import express from "express";
import { Asserts, string, object, number } from "yup";
import { validateInput } from "validate";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const querySchema = object({
      name: string().required().notOneOf(["admin"]),
      age: number()
        .transform((value, original) =>
          original == null || original === "" ? undefined : value
        )
        .min(18)
        .required(),
    });

    const { age, name } = await validateInput<Asserts<typeof querySchema>>(
      querySchema,
      req.body
    );

    return res.json({ age, name });
  } catch (error) {
    res.status(400);
    res.json(error);
  }
});

app.listen(3001);
