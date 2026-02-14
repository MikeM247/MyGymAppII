import type { VercelRequest, VercelResponse } from "@vercel/node";
import { registerSchema } from "@my-gym-app/shared";
import { withHandler, ensureBody, ok } from "../../src/middleware/withHandler.js";
import { userRepository } from "../../src/repositories/userRepository.js";
import { hashPassword } from "../../src/lib/password.js";
import { signToken } from "../../src/lib/jwt.js";
import { HttpError } from "../../src/lib/http.js";

export default withHandler({ methods: ["POST"] }, async (req: VercelRequest, res: VercelResponse) => {
  const input = registerSchema.parse(ensureBody(req.body));

  const existing = await userRepository.findByEmail(input.email);
  if (existing) {
    throw new HttpError(409, "Email already exists");
  }

  const passwordHash = await hashPassword(input.password);
  const user = await userRepository.create({
    email: input.email,
    name: input.name,
    passwordHash
  });

  const token = signToken({ sub: user.id, email: user.email });

  ok(res, {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name
    }
  });
});

