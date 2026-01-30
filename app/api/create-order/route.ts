import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import { User, Order } from '../../../lib/models';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { customer, items, total }: {
      customer: {
        name: string;
        phone: string;
        address: string;
      };
      items: {
        productId: string;
        name: string;
        quantity: number;
        price: number;
      }[];
      total: number;
    } = await request.json();

    // Validate required fields
    if (!customer || !items || !total) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create or find user
    let user = await User.findOne({ phone: customer.phone });
    if (!user) {
      user = await User.create({
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
      });
    }

    // Create order in database
    const order = await Order.create({
      userId: user._id,
      products: items,
      totalAmount: total,
      paymentStatus: 'Pending',
      orderStatus: 'Processing',
    });

    // Create Razorpay order
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: total * 100, // Razorpay expects amount in paisa
      currency: 'INR',
      receipt: order._id.toString(),
      payment_capture: true, // Auto capture payment
    });

    // Update order with Razorpay order ID
    await Order.findByIdAndUpdate(order._id, {
      razorpayOrderId: razorpayOrder.id
    });

    return NextResponse.json({
      id: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: order._id.toString(),
      customer: customer,
      items: items,
      total: total,
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
