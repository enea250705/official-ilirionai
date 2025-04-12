import { getSuggestionsByDocumentId } from '@/lib/db/queries';

// Mock user session
const mockSession = {
  user: {
    id: 'ilirion-user-id',
    name: 'Ilirion User',
    email: 'user@ilirionai.al'
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const documentId = searchParams.get('documentId');

  if (!documentId) {
    return new Response('Not Found', { status: 404 });
  }

  const session = mockSession;

  const suggestions = await getSuggestionsByDocumentId({
    documentId,
  });

  const [suggestion] = suggestions;

  if (!suggestion) {
    return Response.json([], { status: 200 });
  }

  return Response.json(suggestions, { status: 200 });
}
