import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../lib/prisma";

export async function getEvent(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/event/:eventId",
    {
      schema: {
        params: z.object({
          eventId: z.string().uuid(),
        }),
        response: {
          200: z.object({
            event: z.object({
              id: z.string(),
              slug: z.string(),
              title: z.string(),
              details: z.string().nullable(),
              maximumAttendees: z.number().int().nullable(),
              attendeesAmount: z.number().int(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const { eventId } = request.params;

      const event = await prisma.event.findUnique({
        select: {
          id: true,
          slug: true,
          title: true,
          details: true,
          maximumAttendees: true,
          _count: true,
        },
        where: {
          id: eventId,
        },
      });

      if (event === null) {
        throw new Error("Event not found.");
      }

      return reply.send({
        event: {
          id: event.id,
          slug: event.slug,
          title: event.title,
          details: event.details,
          maximumAttendees: event.maximumAttendees,
          attendeesAmount: event._count.Attendee,
        },
      });
    }
  );
}
