import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createProjectGateToken,
  isProtectedProjectPath,
  projectGateCookieOptions,
  projectGateHref,
  projectGatePassword,
  safeNextPath,
  verifyProjectGatePassword,
  verifyProjectGateToken,
} from './project-gate';

function withPassword(value: string | undefined, run: () => void) {
  const previous = process.env.PROJECT_GATE_PASSWORD;
  if (value === undefined) delete process.env.PROJECT_GATE_PASSWORD;
  else process.env.PROJECT_GATE_PASSWORD = value;
  try {
    run();
  } finally {
    if (previous === undefined) delete process.env.PROJECT_GATE_PASSWORD;
    else process.env.PROJECT_GATE_PASSWORD = previous;
  }
}

test('local default password is case-sensitive and used only when the env var is unset', () => {
  withPassword(undefined, () => {
    assert.equal(projectGatePassword(), 'sebmendodesign');
    assert.equal(verifyProjectGatePassword('sebmendodesign'), true);
    assert.equal(verifyProjectGatePassword('SebmendoDesign'), false);
    assert.equal(verifyProjectGatePassword(''), false);
  });
  withPassword('  ', () => {
    assert.equal(verifyProjectGatePassword('sebmendodesign'), true);
  });
});

test('PROJECT_GATE_PASSWORD replaces the local default', () => {
  withPassword('other-secret', () => {
    assert.equal(projectGatePassword(), 'other-secret');
    assert.equal(verifyProjectGatePassword('other-secret'), true);
    assert.equal(verifyProjectGatePassword('sebmendodesign'), false);
  });
});

test('session token is an hmac and dies when the password changes', () => {
  withPassword(undefined, () => {
    const token = createProjectGateToken();
    assert.equal(token.includes('sebmendodesign'), false);
    assert.equal(verifyProjectGateToken(token), true);
    assert.equal(verifyProjectGateToken(undefined), false);
    assert.equal(verifyProjectGateToken('nope'), false);
    assert.equal(verifyProjectGateToken('abc.def'), false);
  });

  let token = '';
  withPassword('first', () => {
    token = createProjectGateToken();
    assert.equal(verifyProjectGateToken(token), true);
  });
  withPassword('second', () => {
    assert.equal(verifyProjectGateToken(token), false);
  });
});

test('unlock cookie is httpOnly and scoped to the browser session', () => {
  const options = projectGateCookieOptions(true);
  assert.equal(options.httpOnly, true);
  assert.equal(options.secure, true);
  assert.equal(options.sameSite, 'lax');
  assert.equal(options.path, '/');
  assert.equal('maxAge' in options, false);
  assert.equal('expires' in options, false);
  assert.equal(projectGateCookieOptions(false).secure, false);
});

test('project routes are gated and public pages are not', () => {
  assert.equal(isProtectedProjectPath('/work/casey-ai'), true);
  assert.equal(isProtectedProjectPath('/work/casey-ai/'), true);
  assert.equal(isProtectedProjectPath('/work/casey-ai.md'), true);
  assert.equal(isProtectedProjectPath('/work/casey-ai/content.json'), true);
  assert.equal(isProtectedProjectPath('/api/markdown/work/casey-ai'), true);
  assert.equal(isProtectedProjectPath('/work'), true);

  assert.equal(isProtectedProjectPath('/'), false);
  assert.equal(isProtectedProjectPath('/about'), false);
  assert.equal(isProtectedProjectPath('/contact'), false);
  assert.equal(isProtectedProjectPath('/privacy'), false);
  assert.equal(isProtectedProjectPath('/seb-sans'), false);
  assert.equal(isProtectedProjectPath('/gate'), false);
  assert.equal(isProtectedProjectPath('/login'), false);
  assert.equal(isProtectedProjectPath('/admin'), false);
  assert.equal(isProtectedProjectPath('/content.json'), false);
  assert.equal(isProtectedProjectPath('/llms-full.txt'), false);
  assert.equal(isProtectedProjectPath('/work/casey-ai/opengraph-image'), false);
  assert.equal(isProtectedProjectPath('/work/casey-ai/opengraph-image.png'), false);
});

test('return path stays on this site', () => {
  assert.equal(safeNextPath('/work/casey-ai'), '/work/casey-ai');
  assert.equal(safeNextPath('/work/casey-ai?x=1'), '/work/casey-ai?x=1');
  assert.equal(safeNextPath('https://evil.example'), '/');
  assert.equal(safeNextPath('//evil.example'), '/');
  assert.equal(safeNextPath('/\\evil'), '/');
  assert.equal(safeNextPath('/gate?next=/work/casey-ai'), '/');
  assert.equal(safeNextPath(null), '/');
  assert.equal(projectGateHref('/work/chase-myhome'), '/gate?next=%2Fwork%2Fchase-myhome');
});
