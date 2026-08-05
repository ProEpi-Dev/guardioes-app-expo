import type { ParticipationProfileExtraMeResponse } from '../types/participation-profile-extra';

export function resolveProfileExtraPayload(
  me: ParticipationProfileExtraMeResponse | null | undefined,
  extraValues: Record<string, unknown>
): { ok: Record<string, unknown> } | { error: 'invalid' | 'empty' } {
  if (!me?.form) {
    return { ok: {} };
  }
  const { _isValid, ...clean } = extraValues as Record<string, unknown> & {
    _isValid?: boolean;
  };
  if (Object.keys(clean).length > 0) {
    if (_isValid === false) {
      return { error: 'invalid' };
    }
    return { ok: clean };
  }
  if (me.submission?.formVersionId === me.form.version.id) {
    return { ok: { ...me.submission.response } };
  }
  return { error: 'empty' };
}
