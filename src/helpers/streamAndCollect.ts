export async function streamAndCollectContent(
  contentGenerator: AsyncGenerator<string>,
  controller: ReadableStreamDefaultController<Uint8Array>,
  encoder: TextEncoder
): Promise<string> {
  let fullContent = '';

  for await (const chunk of contentGenerator) {
    fullContent += chunk;
    controller.enqueue(encoder.encode(chunk));
  }

  controller.close();

  return fullContent;
}
