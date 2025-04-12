import { ArtifactKind } from '@/components/artifact';
import {
  deleteDocumentsByIdAfterTimestamp,
  getDocumentsById,
  saveDocument,
} from '@/lib/db/queries';

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
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const session = mockSession;

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  if (!document) {
    return new Response('Not Found', { status: 404 });
  }

  return Response.json(documents, { status: 200 });
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const session = mockSession;

  const {
    content,
    title,
    kind,
  }: { content: string; title: string; kind: ArtifactKind } =
    await request.json();

  const document = await saveDocument({
    id,
    content,
    title,
    kind,
    userId: session.user.id,
  });

  return Response.json(document, { status: 200 });
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  const { timestamp }: { timestamp: string } = await request.json();

  if (!id) {
    return new Response('Missing id', { status: 400 });
  }

  const session = mockSession;

  const documents = await getDocumentsById({ id });

  const [document] = documents;

  await deleteDocumentsByIdAfterTimestamp({
    id,
    timestamp: new Date(timestamp),
  });

  return new Response('Deleted', { status: 200 });
}
