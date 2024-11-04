import { supabase } from './supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export async function uploadReceipt(file: File): Promise<string> {
  try {
    // Validate file type
    if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
      throw new Error('Invalid file type. Please upload an image file.');
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size too large. Maximum size is 5MB.');
    }

    const fileExt = file.type.split('/')[1];
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;

    // Upload file
    const { error: uploadError } = await supabase.storage
      .from('expense-receipts')
      .upload(filePath, file, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const { data } = supabase.storage
      .from('expense-receipts')
      .getPublicUrl(filePath);

    if (!data.publicUrl) {
      throw new Error('Failed to get public URL');
    }

    return data.publicUrl;
  } catch (error) {
    console.error('Storage error:', error);
    throw error;
  }
}