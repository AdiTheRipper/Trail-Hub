/**
 * Badge generation — Pollinations.ai (100% free, no API key needed)
 *
 * Logic:
 *   1. Check if a badge for this trail already exists in Supabase
 *   2. If yes → return the cached one (free, instant)
 *   3. If no  → build a prompt, hit Pollinations, save URL to DB
 *
 * Badges are generated ONCE per trail and reused for every future
 * hiker who completes it. First hiker on a new trail pays the
 * generation time (~3s), everyone after gets it instantly.
 */

// Shared style suffix — applied to every badge prompt
const BADGE_STYLE = [
  'circular achievement badge',
  'emblem design',
  'detailed illustration',
  'ornate golden border',
  'RPG fantasy game badge style',
  'rich earthy colours',
  'Maharashtra India landscape atmosphere',
  'no text',
].join(', ')

/**
 * Build a descriptive prompt tailored to the trail type.
 */
function buildPrompt(trailName, isFort = false) {
  const subject = isFort
    ? `ancient Maratha hill fort ${trailName} in the Sahyadri mountains Maharashtra India`
    : `${trailName} trek trail in the Sahyadri mountains Maharashtra India`

  return `achievement badge for completing ${subject}, ${BADGE_STYLE}`
}

/**
 * Construct a Pollinations.ai image URL.
 * No API key, no rate limits for personal projects.
 * Docs: https://pollinations.ai
 */
export function buildBadgeImageUrl(trailName, isFort = false) {
  const prompt = buildPrompt(trailName, isFort)
  const encoded = encodeURIComponent(prompt)
  return (
    `https://image.pollinations.ai/prompt/${encoded}` +
    `?width=512&height=512&nologo=true&model=flux`
  )
}

/**
 * Get an existing badge from the DB, or generate + cache a new one.
 *
 * @param {object} supabase  - Supabase client instance
 * @param {string} trailId   - UUID of the trail
 * @param {string} trailName - Human-readable name (used in prompt)
 * @param {boolean} isFort   - Is this a Sahyadri hill fort?
 * @returns {object} badge row from the `badges` table
 */
export async function getOrCreateBadge(supabase, trailId, trailName, isFort = false) {
  // 1. Check cache
  const { data: existing, error: fetchError } = await supabase
    .from('badges')
    .select('*')
    .eq('trail_id', trailId)
    .single()

  if (existing) return existing

  // Ignore "no rows" error (PGRST116), throw everything else
  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError

  // 2. Generate
  const prompt = buildPrompt(trailName, isFort)
  const imageUrl = buildBadgeImageUrl(trailName, isFort)

  // 3. Cache in DB — future hikers on the same trail get this instantly
  const { data: newBadge, error: insertError } = await supabase
    .from('badges')
    .insert({ trail_id: trailId, image_url: imageUrl, prompt_used: prompt })
    .select()
    .single()

  if (insertError) throw insertError
  return newBadge
}

/**
 * Award a badge to a hiker after they complete a trek.
 * Handles the full flow: get/create badge → insert into hiker_badges.
 *
 * @param {object} supabase    - Supabase client instance
 * @param {string} hikerId     - UUID of the hiker
 * @param {string} trekLogId   - UUID of the trek log that triggered the award
 * @param {string} trailId     - UUID of the trail
 * @param {string} trailName   - Trail name (for prompt generation if needed)
 * @param {boolean} isFort     - Is this a fort trail?
 * @param {boolean} isVerified - Was the trek GPS-verified?
 * @returns {object} hiker_badge row
 */
export async function awardBadge(
  supabase,
  hikerId,
  trekLogId,
  trailId,
  trailName,
  isFort = false,
  isVerified = false
) {
  const badge = await getOrCreateBadge(supabase, trailId, trailName, isFort)

  const { data, error } = await supabase
    .from('hiker_badges')
    .insert({
      hiker_id: hikerId,
      badge_id: badge.id,
      trek_log_id: trekLogId,
      is_verified: isVerified,
    })
    .select()
    .single()

  if (error) throw error
  return { badge, hikerBadge: data }
}
