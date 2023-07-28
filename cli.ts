import { z } from "zod";
import prompts from "prompts";

// {
//     "slot": 1,
//     "type": {
//       "name": "grass",
//       "url": "https://pokeapi.co/api/v2/type/12/"
//     }
//   },

const typeSchema = z.array(
  z.object({
    type: z.object({
      name: z.string(),
    }),
  })
);

const pokemonSchema = z.object({
  weight: z.number(),
  types: typeSchema,
});

type Pokemon = z.infer<typeof pokemonSchema>;

async function getPokemonInfo(name: string): Promise<Pokemon | null> {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
  const data = await res.json();

  if (res.ok) {
    const response = pokemonSchema.safeParse(data);

    if (response.success) {
      console.log(response.data);
    }
  }

  return null;
}

(async () => {
  const response = await prompts({
    type: "text",
    name: "input",
    message: "Name of pokemon",
    validate: (input) => typeof input === "string",
  });

  const output = await getPokemonInfo(response.input);

  console.log(output?.weight);
  console.log(output?.types.map((type) => type.type.name));
})();
