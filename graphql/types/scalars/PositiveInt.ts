import { asNexusMethod } from "nexus";
import { GraphQLPositiveInt } from "graphql-scalars"; // 1

export const GQLPositiveInt = asNexusMethod(GraphQLPositiveInt, "positiveInt");