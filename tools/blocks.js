/* =====================================================================
   DomCom Insure: site-specific block types for tools/build.js (kit hook).

   "split": the two-sided Domestic / Commercial panels (homepage).
     { "type": "split", "panels": [{ "side": "dom" | "com", "eyebrow", "title", "text",
       "items": [{ "title", "slug", "icon" }], "cta": { "label", "slug" } }] }

   "schedule": an "at a glance" box styled like a policy schedule.
     { "type": "schedule", "title": "At a glance", "ref": "DC-HOME", "side": "dom" | "com",
       "rows": [["Who needs it", "html"], ...], "note": "html" }

   "covers": what a policy usually covers, usually excludes, and common add-ons.
     { "type": "covers", "title", "intro", "covered": ["html"], "excluded": ["html"], "addons": ["html"] }
     Wording is general: always tell readers to check their own policy wording.

   "matrix": is it a legal requirement? one row per cover, one column per region.
     { "type": "matrix", "title", "intro", "cols": ["UK", "USA", "EU"],
       "rows": [{ "label", "slug", "cells": [["yes" | "no" | "varies" | "lender", "short html"], ...] }] }

   "checker": the cover checker (radio questions → list of covers to look at).
     { "type": "checker", "questions": [{ "id", "q", "hint", "showIf": { "qid": ["v"] },
         "options": [{ "v", "label" }] }],
       "covers": [{ "title", "slug", "need": "must" | "should" | "consider", "why": "html",
         "when": { "qid": ["v", ...] } }] }
     Every cover card is in the HTML (works without JS); assets/site.js filters them.
   ===================================================================== */
const head = (b, k) => b.title ? `<div class="block-head"><h2>${k.esc(b.title)}</h2>${b.intro ? `<p>${b.intro}</p>` : ''}</div>` : '';
const href = (slug, k) => k.pagePath(k.bySlug.get(slug) || { slug });
const NEED = { must: 'Legal or lender requirement', should: 'Strongly consider', consider: 'Worth a look' };
const MARK = { yes: 'Required', no: 'Not required', varies: 'Depends', lender: 'Lender / contract' };

function check(b, p, k) {
  for (const it of [...(b.items || []), ...(b.panels || []).flatMap(x => x.items || []), ...(b.covers || []), ...(b.rows || [])])
    if (it.slug && !k.bySlug.has(it.slug)) k.errors.push(`${p._file}: ${b.type} block links to missing page "${it.slug}"`);
}

module.exports = {
  split(b, p, k) {
    check(b, p, k);
    return `<section class="blocks blocks-split"><div class="wrap split">${(b.panels || []).map(x => `
  <div class="panel panel-${k.esc(x.side)}">
    <p class="panel-eyebrow">${k.icon(x.side === 'com' ? 'building' : 'house')}${k.esc(x.eyebrow || '')}</p>
    <h2>${k.esc(x.title)}</h2>${x.text ? `<p class="panel-text">${x.text}</p>` : ''}
    <ul class="panel-list">${(x.items || []).map(it => `<li><a href="${href(it.slug, k)}">${k.icon(it.icon || 'check')}<span>${k.esc(it.title)}</span><b aria-hidden="true">→</b></a></li>`).join('')}</ul>
    ${x.cta ? `<a class="panel-cta" href="${href(x.cta.slug, k)}">${k.esc(x.cta.label)} →</a>` : ''}
  </div>`).join('')}</div></section>`;
  },

  schedule(b, p, k) {
    return `<section class="blocks blocks-schedule"><div class="wrap"><div class="schedule side-${k.esc(b.side || 'dom')}">
  <div class="schedule-head"><h2>${k.esc(b.title || 'At a glance')}</h2>${b.ref ? `<span class="schedule-ref">Ref. ${k.esc(b.ref)}</span>` : ''}</div>
  <dl>${(b.rows || []).map(([t, d]) => `<div><dt>${k.esc(t)}</dt><dd>${d}</dd></div>`).join('')}</dl>
  ${b.note ? `<p class="schedule-note">${b.note}</p>` : ''}</div></div></section>`;
  },

  covers(b, p, k) {
    const col = (cls, t, ic, list) => list?.length ? `<div class="cov cov-${cls}"><h3>${k.icon(ic)}${t}</h3><ul>${list.map(x => `<li>${x}</li>`).join('')}</ul></div>` : '';
    return `<section class="blocks blocks-covers"><div class="wrap">${head(b, k)}<div class="covers">
  ${col('in', 'Usually covered', 'check', b.covered)}${col('out', 'Usually not covered', 'alert', b.excluded)}${col('add', 'Common add-ons', 'star', b.addons)}
</div><p class="covers-note">General guide only. Cover varies by insurer and policy: the policy wording and key facts document decide what you’re actually insured for.</p></div></section>`;
  },

  matrix(b, p, k) {
    check(b, p, k);
    const cols = b.cols || ['UK', 'USA', 'EU'];
    return `<section class="blocks blocks-matrix"><div class="wrap">${head(b, k)}<div class="matrix-scroll"><table class="matrix">
  <thead><tr><th scope="col">Cover</th>${cols.map(c => `<th scope="col">${k.esc(c)}</th>`).join('')}</tr></thead>
  <tbody>${(b.rows || []).map(r => `<tr><th scope="row">${r.slug ? `<a href="${href(r.slug, k)}">${k.esc(r.label)}</a>` : k.esc(r.label)}</th>${(r.cells || []).map(([m, t]) =>
    `<td><span class="mk mk-${k.esc(m)}">${MARK[m] || k.esc(m)}</span>${t ? `<small>${t}</small>` : ''}</td>`).join('')}</tr>`).join('')}</tbody>
</table></div><p class="covers-note">Summary only, as of the date this page was updated. Rules differ by country, state and situation, so check the official source for yours.</p></div></section>`;
  },

  checker(b, p, k) {
    check(b, p, k);
    const qs = (b.questions || []).map((q, n) => `<fieldset class="ck-q" data-q="${k.esc(q.id)}"${q.showIf ? ` data-show-if='${k.esc(JSON.stringify(q.showIf))}'` : ''}>
    <legend><span class="ck-n">${String(n + 1).padStart(2, '0')}</span>${k.esc(q.q)}</legend>${q.hint ? `<p class="ck-hint">${k.esc(q.hint)}</p>` : ''}
    <div class="ck-opts">${q.options.map(o => `<label><input type="radio" name="${k.esc(q.id)}" value="${k.esc(o.v)}"><span>${k.esc(o.label)}</span></label>`).join('')}</div></fieldset>`).join('\n');
    const covers = (b.covers || []).map(c => `<a class="ck-cover need-${k.esc(c.need)}" href="${href(c.slug, k)}" data-when='${k.esc(JSON.stringify(c.when || {}))}' data-need="${k.esc(c.need)}">
    <span class="ck-need">${NEED[c.need] || ''}</span><h3>${k.esc(c.title)}</h3><p>${c.why}</p><span class="cta">Read the guide →</span></a>`).join('\n');
    return `<section class="blocks blocks-checker"><div class="wrap checker" data-checker>
  <form class="ck-form" onsubmit="return false">${qs}
    <div class="ck-actions"><button type="reset" class="ck-reset">Start again</button></div>
  </form>
  <div class="ck-results">
    <div class="ck-summary" aria-live="polite"><p class="ck-count" data-ck-count>Answer the questions to build your cover list.</p></div>
    <div class="ck-list">${covers}</div>
    <p class="covers-note">A starting point, not advice. It flags the covers people in your situation usually look at; your circumstances, contracts and local law decide what you actually need.</p>
  </div>
</div></section>`;
  },
};
