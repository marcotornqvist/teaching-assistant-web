// 1. In this view teachers can create material which can then be turned into tasks for the AI generated tasks in the tasks/create/api route.
// 2. Teachers can also use the tiptap editor to use AI to generate the material. This route will only be used to create the material and store it in the database.

export const POST = async (request: Request) => {
  const res = await request.json();

  console.log(res);
  return Response.json({ res });
};
