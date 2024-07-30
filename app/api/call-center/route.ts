export const GET = () => {
  const { id, name, age } = { id: 10, name: "Sasindu", age: 23 };
  return Response.json({ id, name, age}, { status: 200 });
};
