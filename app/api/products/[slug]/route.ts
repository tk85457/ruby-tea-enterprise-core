import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/lib/models';
import { getProductBySlug } from '@/data/products';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  try {
    await dbConnect();
    // Try to find in DB by slug
    let product = await Product.findOne({ slug }).lean();

    // If not found by slug, try searching by _id (valid BSON ID pattern check)
    if (!product && slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug).lean();
    }

    if (product) {
      return NextResponse.json({ product });
    }

    return NextResponse.json({ error: 'Product not found in archive' }, { status: 404 });
  } catch (error) {
    console.error('Database fetch failed:', error);
    return NextResponse.json({ error: 'Infrastructure interruption' }, { status: 500 });
  }
}
