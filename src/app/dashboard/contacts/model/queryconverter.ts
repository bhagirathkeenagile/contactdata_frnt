// queryConverter.ts

export function convertToPrismaQuery(condition: any) {
  if (condition.groupName === "and") {
    // Handle AND condition
    const andConditions = condition.items.map(convertToPrismaQuery);
    return { AND: andConditions };
  } else if (condition.groupName === "or") {
    // Handle OR condition
    const orConditions = condition.items.map(convertToPrismaQuery);
    return { OR: orConditions };
  } else {
    // Handle field-based condition
    const { field, operator, value } = condition;
    if (field !== "Account") {
      switch (operator) {
        case "contains":
          return { [field]: { contains: value } };
        case "doesNotContain":
          return { NOT: { [field]: { contains: value } } };
        case ">":
          return { [field]: { gt: parseFloat(value) } };
        case "=":
          return { [field]: value };
        case "<>":
          return { NOT: { [field]: value } };
        case "<":
          return { [field]: { lt: parseFloat(value) } };
        case ">=":
          return { [field]: { gte: parseFloat(value) } };
        case "<=":
          return { [field]: { lte: parseFloat(value) } };
        case "==":
          return { [field]: value };
        case "!=":
          return { NOT: { [field]: value } };

        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    } else {
      switch (operator) {
        case "contains":
          return { [field]: { Name: { contains: value } } };
        case "doesNotContain":
          return { NOT: { [field]: { Name: { contains: value } } } };
        case "=":
          return { [field]: { Name: value } };
        case "<>":
          return { NOT: { [field]: { Name: value } } };
        default:
          throw new Error(`Unsupported operator: ${operator}`);
      }
    }
  }
}
