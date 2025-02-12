import { NextResponse } from "next/server";
import { inference } from "@/utils/hf";

const alpacaPrompt = (instruction, input) => `
### Instruction:
${instruction}

### Input:
${input}

### Response:
`;

export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  // console.log(searchParams);
  const text = searchParams.get("text");
  const movie = searchParams.get("movie");

  const llama = inference.endpoint(
    "https://xpmn29hw2sp2i0xv.eu-west-1.aws.endpoints.huggingface.cloud",
  );

  const out = await llama.textGeneration({
    inputs: alpacaPrompt(text, movie),
    parameters: {
      do_sample: true,
      max_new_tokens: 150,
      temperature: 0.7, // Controls randomness (higher = more diverse)
      top_p: 0.9, // Nucleus sampling (higher = more creativity)
      top_k: 50,
    },
  });

  // console.log(alpacaPrompt(text, movie));
  const generatedText = out.generated_text;

  const responsePart = generatedText.split("### Response:\n")[1]?.trim();

  console.log(responsePart);
  const response = responsePart.split("###")[0].trim();
  console.log(response);

  return NextResponse.json(response, { status: 200 });
}
