interface Env {
  USERNAME: string;
  PASSWORD: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const ALLOWED_ORIGINS = [
      "https://dominicana-nine.vercel.app",
      "http://localhost:3000"
    ];

    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    try {
      const body = await request.json();
      const lastInvoice =
        typeof body.lastInvoice === "string" && body.lastInvoice.trim().length > 0
          ? body.lastInvoice
          : "E310008000001";
      const searchRange = body.searchRange ?? 50;

      const rnc = "131980899";
      const username = env.USERNAME;
      const password = env.PASSWORD;

      const credentials = btoa(`${username}:${password}`);
      const tokenRes = await fetch("https://labdo.guru-soft.com/Empresarial/1.0/Autenticacion/Api/ServicioEDOC?Id=3#", {
        method: "GET",
        headers: {
          "Authorization": `Basic ${credentials}`
        }
      });

      if (!tokenRes.ok) {
        return new Response(JSON.stringify({ error: "Failed to obtain token" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }

      const tokenData = await tokenRes.json();
      const token = tokenData.token;

      const baseNumber = parseInt(lastInvoice.slice(6));
      const prefix = lastInvoice.slice(0, 6);

      for (let i = 0; i <= searchRange; i++) {
        const number = (baseNumber + i).toString().padStart(6, '0');
        const invoiceNumber = `${prefix}${number}`;

        const url = `https://labdo.guru-soft.com/Empresarial/1.0/Emision/Consulta/Estado/Api/Documento?RNCEmisor=${rnc}&NumDocumento=${invoiceNumber}`;

        const invoiceRes = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const text = await invoiceRes.text();
        let json;
        try {
          json = JSON.parse(text);
        } catch {
          continue;
        }

        if (invoiceRes.status === 400 && json?.MensajeRespuesta === "Documento no encontrado.") {
          return new Response(
            JSON.stringify({
              message: "Available invoice found",
              invoice: invoiceNumber,
              details: json
            }),
            {
              headers: { ...corsHeaders, "Content-Type": "application/json" }
            }
          );
        }
      }

      return new Response(
        JSON.stringify({ message: "No available invoice found", invoice: null }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } catch (err: any) {
      return new Response(JSON.stringify({ error: `General error: ${err.message}` }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }
  }
};
