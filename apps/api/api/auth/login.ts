import type { VercelRequest, VercelResponse } from "@vercel/node";
import { loginSchema } from "@my-gym-app/shared";
import { withHandler, ensureBody, ok } from "../../src/middleware/withHandler.js";
import { userRepository } from "../../src/repositories/userRepository.js";
import { verifyPassword } from "../../src/lib/password.js";
import { signToken } from "../../src/lib/jwt.js";
import { HttpError } from "../../src/lib/http.js";

export default withHandler({ methods: ["POST"] }, async (req: VercelRequest, res: VercelResponse) => {
  const input = loginSchema.parse(ensureBody(req.body));

  const user = await userRepository.findByEmail(input.email);
  if (!user) {
    throw new HttpError(401, "Invalid credentials");
  }

  const valid = await verifyPassword(input.password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid credentials");
  }

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

