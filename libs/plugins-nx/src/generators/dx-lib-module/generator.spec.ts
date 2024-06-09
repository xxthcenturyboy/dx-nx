import { createTreeWithEmptyWorkspace } from '@nx/devkit/testing';
import { Tree, readProjectConfiguration } from '@nx/devkit';

import { dxLibModuleGenerator } from './generator';
import { DxLibModuleGeneratorSchema } from './schema';

describe('dx-lib-module generator', () => {
  let tree: Tree;
  const options: DxLibModuleGeneratorSchema = { name: 'test', directory: 'libs' };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await dxLibModuleGenerator(tree, options);
    const config = readProjectConfiguration(tree, 'test');
    expect(config).toBeDefined();
  });
});
