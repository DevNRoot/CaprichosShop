import { prisma } from "./src/lib/prisma.js";

async function main() {
  const correlativo = await prisma.correlativos.findUnique({
    where: {
      ruc_emisor_tipo_comprobante_serie: {
        ruc_emisor: "10181538703",
        tipo_comprobante: "03",
        serie: "B001",
      },
    },
  });

  if (!correlativo) {
    throw new Error("No existe el correlativo configurado.");
  }

  const numeroActual = Number(correlativo.ultimo_numero);
  const siguienteNumero = numeroActual + 1;

  console.log("NÚMERO ACTUAL:", numeroActual);
  console.log("SIGUIENTE NÚMERO:", siguienteNumero);
  console.log(
    "COMPROBANTE:",
    `${correlativo.serie}-${String(siguienteNumero).padStart(6, "0")}`
  );
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });