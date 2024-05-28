"use server";
import OpenAI from "openai";

const openai = new OpenAI({
  organization: "org-zv3ClO9zuKm5irHRNM1T05ey",
  project: "proj_4tbeuwi5MG5eC9XStjaPwbmQ",
});

interface IGetRecommendedCare {
  plantName: "tomatoes";
  stage: "seedling" | "vegetative" | "flowering";
  ec: number;
  waterLevel: string;
  temperature: number;
  ph: number;
}

export interface Recommendation {
  ph: string;
  ec: string;
  temperature: string;
  water: string;
  encouragement: string;
}

export async function getRecommendedCare({
  plantName,
  stage,
  ec,
  waterLevel,
  temperature,
  ph,
}: IGetRecommendedCare): Promise<Recommendation> {
  const idealParameters = {
    tomatoes: {
      seedling: {
        ec: "1.2 to 1.6",
        waterLevel: "NORMMAL",
        temperature: "75F to 85F",
        ph: "5.5 to 6.5",
      },
      vegetative: {
        ec: "1.8 to 2.4",
        waterLevel: "NORMMAL",
        temperature: "75 F to 85 F",
        ph: "5.5 to 6.5",
      },
      flowering: {
        ec: "2.4 to 4.0",
        waterLevel: "NORMAL",
        temperature: "75F to 85F",
        ph: "5.5 to 6.5",
      },
    },
  };
  const prompt = `Plant variant: ${plantName}\nEC: ${ec}\nWater Level: ${waterLevel}\nTemperature: ${temperature}\npH: ${ph}\n Stage: ${stage}\n\n. Given these parameters, the plants are growing hydroponically and the ${JSON.stringify(
    idealParameters[plantName][stage]
  )} for each one of "Temperature, PH, and EC" what needs to be changed? Reply in a very short summarized message if we need to make any changes to any of the parameter EC, Water Level, PH and Temperature, to the recommended levels. Be strict with the proper range these plants are very important. Don't format the output but add a '<new line>' between each parameter. Have a honest but encouring tone, let them know how their plants are doing in relation to what they are providing them with. Output the message in the format
  {ph}your recommendation{end}{ec}your recommendation{end}{temperature}your recommendation{end}{water}your recommendation{end}{encouragement}your encouragement{end}. If no changes needed for a parameter omit it in the output.`;
  console.log(prompt);
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: prompt,
      },
    ],
    max_tokens: 4096,
  });

  console.log(response);

  return parseRecommendations(
    response.choices[0].message.content ?? "No recommendations found."
  );
}

function parseRecommendations(recommendations: string): Recommendation {
  const regex = /{(\w+)}(.*?){end}/g;
  const matches = [...recommendations.matchAll(regex)];
  console.log(matches);
  return matches.reduce((acc, match) => {
    const [, key, value] = match;
    acc[key] = value;
    return acc;
  }, {});
}
