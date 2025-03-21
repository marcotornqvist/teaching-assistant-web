import { NextResponse } from 'next/server';
import { z } from 'zod';
import fs from 'node:fs/promises';
import { Base64FileSchema, FileUploadSchema } from 'lib/schema';

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const result = Base64FileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          status: 'error',
          errors: result.error.errors,
        },
        { status: 400 },
      );
    }

    const { name, type, data } = result.data.file;
    const base64Data = data.split(',')[1];
    const buffer = Buffer.from(base64Data, 'base64');
    await fs.writeFile(`./${name}`, buffer);

    return NextResponse.json({ status: 'success' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ status: 'fail', error: e });
  }
};
