export const onRequestGet: PagesFunction = async () =>
  new Response(
    JSON.stringify({
      time: new Date().toISOString(),
    }),
    {
      headers: {
        "content-type": "application/json",
      },
    }
  );
