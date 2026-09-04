import { prisma } from "./src/lib/prisma.js";

async function main() {
  const rucEmisor = "10181538703";
  const tipoComprobante = "03";
  const serie = "EB01";

  try {
    await prisma.$transaction(async (tx) => {
      const resultado = await tx.$queryRaw`
        UPDATE correlativos
        SET ultimo_numero = ultimo_numero + 1
        WHERE ruc_emisor = ${rucEmisor}
          AND tipo_comprobante = ${tipoComprobante}
          AND serie = ${serie}
        RETURNING ultimo_numero;
      `;

      console.log("NÚMERO DESPUÉS DEL UPDATE:");
      console.log(Number(resultado[0].ultimo_numero));

      throw new Error("ROLLBACK_PRUEBA");
    });
  } catch (error) {
    if (error.message === "ROLLBACK_PRUEBA") {
      console.log("ROLLBACK EJECUTADO CORRECTAMENTE");
    } else {
      throw error;
    }
  }

  const correlativoFinal = await prisma.correlativos.findUnique({
    where: {
      ruc_emisor_tipo_comprobante_serie: {
        ruc_emisor: rucEmisor,
        tipo_comprobante: tipoComprobante,
        serie: serie,
      },
    },
  });

  console.log("NÚMERO FINAL EN BD:");
  console.log(Number(correlativoFinal.ultimo_numero));
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });