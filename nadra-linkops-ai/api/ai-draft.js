module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { complaint, extraContext = '', systemPrompt = '' } = body;

    if (!complaint) {
      res.status(400).json({ error: 'Missing complaint payload' });
      return;
    }

    const apiKey = process.env.OPENROUTER_API_KEY || process.env.AI_API_KEY || '';
    const model = process.env.OPENROUTER_MODEL || 'openai/gpt-4.1-mini';

    if (!apiKey) {
      res.status(200).json({
        output: buildFallback(complaint, extraContext),
        mode: 'fallback'
      });
      return;
    }

    const prompt = `${systemPrompt}\n\nComplaint Context:\n${JSON.stringify(complaint, null, 2)}\n\nAdditional Context:\n${extraContext || 'None'}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.PUBLIC_APP_URL || 'https://example.com',
        'X-Title': 'NADRA Network Complaint Management System'
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(200).json({
        output: buildFallback(complaint, extraContext) + `\n\n[Live AI API error fallback used: ${text.slice(0, 300)}]`,
        mode: 'fallback-api-error'
      });
      return;
    }

    const data = await response.json();
    const output = data?.choices?.[0]?.message?.content?.trim();

    res.status(200).json({
      output: output || buildFallback(complaint, extraContext),
      mode: output ? 'live-ai' : 'fallback-empty'
    });
  } catch (error) {
    res.status(200).json({
      output: `AI service error, fallback used.\n\n${error.message}`,
      mode: 'error'
    });
  }
};

function buildFallback(record, extraContext) {
  const genuine = ['Primary link down', 'Secondary link down', 'Both links down', 'Provider outage', 'Router / CPE issue', 'DVBrcs IDU / ODU issue', 'Low bandwidth on DVBrcs'].includes(record.validatedCause);
  const classification = genuine
    ? 'Genuine connectivity issue — the available indicators suggest a WAN, provider, or network-edge related fault.'
    : 'Likely non-connectivity or local issue — the available indicators suggest a LAN, power, endpoint, or HQ application-side problem rather than a carrier outage.';
  const severity = record.userImpact === 'Critical' || record.linkRole === 'Both'
    ? 'Critical'
    : record.userImpact || 'Medium';

  return `Classification\n${classification}\n\nSeverity\n${severity}\n\nEscalation Email\nSubject: Urgent Network Complaint at ${record.dauName} — ${record.complaintId}\n\nDear ${record.provider} Support Team,\n\nIt is respectfully submitted that ${record.dauName}, ${record.district}, is currently facing a service disruption on the ${record.linkRole.toLowerCase()} link provided by your organization. The complaint has been reviewed through regional monitoring and requires urgent attention.\n\nComplaint ID: ${record.complaintId}\nTelecom Ticket: ${record.telecomTicket || 'Pending launch'}\nDisruption Start: ${record.disruptionStart}\nIssue Nature: ${record.issueNature}\nValidated Cause: ${record.validatedCause}\nBusiness Impact: ${record.userImpact}\n\nRegional notes: ${record.remarks || 'Issue under verification.'}\n${extraContext ? `Additional context: ${extraContext}\n` : ''}You are requested to investigate the matter on priority and share the estimated restoration time at the earliest. HQ is being kept in CC for visibility and record.\n\nRegards,\nNetwork Engineer\nNADRA RHO Quetta Region\n\nSite Update\nDear ${record.inchargeName}, your complaint ${record.complaintId} has been examined through NMS and has been formally escalated to ${record.provider}. HQ has also been informed. Further updates will be shared as soon as restoration ETA or provider feedback is received.\n\nNext Technical Steps\n1. Reconfirm NMS alarms and link reachability.\n2. Verify power, modem/router status, and LAN from site.\n3. Launch or update telecom complaint ticket.\n4. Keep HQ in CC in the escalation mail.\n5. Record resolution time and final root cause after restoration.`;
}
