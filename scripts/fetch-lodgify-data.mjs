import { execSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';

const outputPath = new URL('../src/data/generated/lodgify.json', import.meta.url);
const propertyIds = ['533203', '746614'];

function tryKeychainLookup() {
  const commands = [
    'security find-generic-password -s lodgify-api-key -a jarvis -w',
    'security find-generic-password -s lodgify-api-key -w',
  ];

  for (const command of commands) {
    try {
      return execSync(command, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
    } catch {
      continue;
    }
  }

  return '';
}

function money(value) {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function cleanText(value) {
  return typeof value === 'string'
    ? value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    : '';
}

function normalizeProperty(detail, summary) {
  const minRate =
    money(detail?.price_from) ??
    money(detail?.base_rate) ??
    money(summary?.price_from) ??
    money(summary?.base_rate);
  const maxRate =
    money(detail?.price_to) ??
    money(detail?.max_rate) ??
    money(summary?.price_to) ??
    minRate;
  const currency =
    detail?.currency_code ?? detail?.currency ?? summary?.currency_code ?? summary?.currency ?? 'USD';

  return {
    id: String(detail?.id ?? summary?.id ?? ''),
    name: cleanText(detail?.name ?? summary?.name ?? ''),
    description: cleanText(detail?.description ?? summary?.description ?? ''),
    address:
      [detail?.address?.street, detail?.address?.city, detail?.address?.state, detail?.address?.zip]
        .filter(Boolean)
        .join(', ') || summary?.address || '',
    currency,
    nightlyRange:
      minRate && maxRate
        ? `$${Math.round(minRate)}-$${Math.round(maxRate)}`
        : minRate
          ? `$${Math.round(minRate)}`
          : null,
    avgNightly: minRate,
    availabilitySummary:
      detail?.availability_summary ??
      summary?.availability_summary ??
      'Live availability is shown in the Lodgify widget.',
  };
}

async function fetchJson(url, apiKey) {
  const response = await fetch(url, {
    headers: {
      'X-ApiKey': apiKey,
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

async function main() {
  const apiKey = process.env.LODGIFY_API_KEY || tryKeychainLookup();
  let payload = {
    generatedAt: null,
    source: 'fallback',
    properties: {},
  };

  if (apiKey) {
    try {
      const summaryResponse = await fetchJson('https://api.lodgify.com/v1/properties', apiKey);
      const summaries = Array.isArray(summaryResponse)
        ? summaryResponse
        : summaryResponse?.items ?? summaryResponse?.properties ?? [];

      const details = await Promise.all(
        propertyIds.map(async (id) => {
          const detail = await fetchJson(`https://api.lodgify.com/v2/properties/${id}`, apiKey);
          const summary = summaries.find((item) => String(item.id) === id);
          return normalizeProperty(detail, summary);
        }),
      );

      payload = {
        generatedAt: new Date().toISOString(),
        source: 'lodgify-api',
        properties: Object.fromEntries(details.map((item) => [item.id, item])),
      };
    } catch (error) {
      payload = {
        generatedAt: new Date().toISOString(),
        source: `fallback-after-error:${error.message}`,
        properties: {},
      };
    }
  }

  await mkdir(new URL('../src/data/generated/', import.meta.url), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
}

main();
