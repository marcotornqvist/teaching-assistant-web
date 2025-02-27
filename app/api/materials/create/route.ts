import { NextRequest } from 'next/server';

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    console.log(body);
    return Response.json({
      success: true,
      message: 'Material created',
      body: body,
    });
  } catch (error) {
    console.error('Error creating material:', error);
    return Response.json(
      { success: false, message: 'Failed to create material' },
      { status: 500 },
    );
  }
};
