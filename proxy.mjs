import { next } from '@vercel/functions';

export default function proxy(request) {
  const expectedUser = 'preview';
  const expectedPassword = process.env.SITE_PIN;

  if (!expectedPassword) {
    return new Response('SITE_PIN is not configured.', { status: 500 });
  }

  const auth = request.headers.get('authorization');

  if (auth && auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.substring(6));
      const separator = decoded.indexOf(':');
      const user = decoded.substring(0, separator);
      const password = decoded.substring(separator + 1);

      if (user === expectedUser && password === expectedPassword) {
        return next();
      }
    } catch (e) {}
  }

  return new Response('Apeos C7072 preview. Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Apeos C7072 Preview", charset="UTF-8"',
      'Cache-Control': 'no-store'
    }
  });
}
