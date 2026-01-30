'use server';

import dbConnect from './dbConnect';
import Product from '../models/Product';
import { revalidatePath } from 'next/cache';
import { uploadImage } from './cloudinary';
import { pusherServer } from './pusher';
import { logActivity } from './logger';

export async function addProduct(formData: FormData, adminId: string = 'system') {
  await dbConnect();

  try {
    const name = formData.get('name') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const category = formData.get('category') as string;
    const description = formData.get('description') as string;
    const weight = formData.get('weight') as string;
    const sku = formData.get('sku') as string;
    const originalPrice = formData.get('originalPrice') ? Number(formData.get('originalPrice')) : undefined;
    const imageFile = formData.get('image') as string;
    const cost = formData.get('cost') ? Number(formData.get('cost')) : undefined;
    const status = formData.get('status') as string || 'active';
    const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';

    if (!name || !price || !category) {
       throw new Error('Missing required fields');
    }

    let imageUrl = '/images/products/classic_ruby_tea_product_1769690994852.png';
    if (imageFile && imageFile.startsWith('data:image')) {
      imageUrl = await uploadImage(imageFile, 'products');
    }

    const slug = name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

    const newProduct = await Product.create({
      name,
      slug,
      price,
      originalPrice,
      cost,
      status,
      featured,
      stock,
      sku,
      category,
      description: description || 'Premium Tea from Ruby Tea',
      weight: weight || '100g',
      image: imageUrl,
    });

    // Real-time Update
    await pusherServer.trigger('admin-events', 'product_created', { product: newProduct });

    // Activity Log
    await logActivity({
      userId: adminId,
      action: 'CREATE_PRODUCT',
      entity: 'Product',
      entityId: newProduct._id,
      details: { name: newProduct.name }
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/inventory');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true, message: 'Product added successfully', product: newProduct };
  } catch (error) {
    console.error('Failed to add product:', error);
    return { success: false, message: 'Failed to add product' };
  }
}

export async function updateProduct(productId: string, formData: FormData, adminId: string = 'system') {
  await dbConnect();

  try {
    const updates: any = {
      name: formData.get('name') as string,
      price: Number(formData.get('price')),
      stock: Number(formData.get('stock')),
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      weight: formData.get('weight') as string,
      sku: formData.get('sku') as string,
      originalPrice: formData.get('originalPrice') ? Number(formData.get('originalPrice')) : undefined,
      cost: formData.get('cost') ? Number(formData.get('cost')) : undefined,
      status: formData.get('status') as string,
      featured: formData.get('featured') === 'on' || formData.get('featured') === 'true',
    };

    const imageFile = formData.get('image') as string;
    if (imageFile && imageFile.startsWith('data:image')) {
      updates.image = await uploadImage(imageFile, 'products');
    }

    if (updates.name) {
      updates.slug = updates.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId, updates, { new: true });

    // Real-time Update
    await pusherServer.trigger('admin-events', 'product_updated', { product: updatedProduct });

    // Activity Log
    await logActivity({
      userId: adminId,
      action: 'UPDATE_PRODUCT',
      entity: 'Product',
      entityId: productId,
      details: { name: updatedProduct.name }
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/inventory');
    revalidatePath('/products');
    revalidatePath(`/products/${updates.slug || productId}`);
    revalidatePath('/');

    return { success: true, message: 'Product updated successfully' };
  } catch (error) {
    console.error('Failed to update product:', error);
    return { success: false, message: 'Failed to update' };
  }
}

export async function deleteProduct(productId: string, adminId: string = 'system') {
  await dbConnect();

  try {
    const product = await Product.findById(productId);
    if (!product) throw new Error('Product not found');

    await Product.findByIdAndDelete(productId);

    // Real-time Update
    await pusherServer.trigger('admin-events', 'product_deleted', { productId });

    // Activity Log
    await logActivity({
      userId: adminId,
      action: 'DELETE_PRODUCT',
      entity: 'Product',
      entityId: productId,
      details: { name: product.name }
    });

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/inventory');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true, message: 'Product deleted' };
  } catch (error) {
    console.error('Failed to delete product:', error);
    return { success: false, message: 'Failed to delete' };
  }
}

export async function updateStock(productId: string, newStock: number, adminId: string = 'system') {
  await dbConnect();

  try {
    const product = await Product.findByIdAndUpdate(productId, { stock: newStock }, { new: true });

    // Real-time Update
    await pusherServer.trigger('admin-events', 'stock_updated', {
        productId,
        newStock: product.stock,
        name: product.name
    });

    // Activity Log
    await logActivity({
      userId: adminId,
      action: 'UPDATE_STOCK',
      entity: 'Product',
      entityId: productId,
      details: { name: product.name, newStock }
    });

    revalidatePath('/dashboard/inventory');
    revalidatePath('/dashboard/products');
    revalidatePath('/products');
    revalidatePath('/');

    return { success: true, message: 'Stock updated' };
  } catch (error) {
    console.error('Failed to update stock:', error);
    return { success: false, message: 'Failed to update stock' };
  }
}
