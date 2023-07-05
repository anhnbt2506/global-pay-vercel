const routes = [
  {
    id: 'root',
    url: '/',
    method: 'GET',
    variants: [
      {
        id: '200',
        type: 'json',
        options: {
          status: 200,
          body: {
            message: 'OK',
          },
        },
      },
    ],
  },
];

export default routes;
