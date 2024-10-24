import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  Tree,
  updateJson,
} from '@nx/devkit';
import * as path from 'path';
import { DxLibModuleGeneratorSchema } from './schema';
import {
  convertpHyphensToUnderscores,
  hyphenatedToTilteCaseConcatenated,
  stripHyphens,
  uppercase,
} from '@dx/util-strings';

async function updateTsConfig(tree: Tree, schema: DxLibModuleGeneratorSchema) {
  updateJson(tree, 'tsconfig.base.json', (tsconfig) => {
    tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths ?? {};
    tsconfig.compilerOptions.paths[`@dx/${schema.name}`] = [
      `${schema.directory}/${schema.name}/src/index.ts`,
    ];
    return tsconfig;
  });
}

export async function dxLibModuleGenerator(
  tree: Tree,
  options: DxLibModuleGeneratorSchema
) {
  const projectRoot = `${options.directory}/${options.name}`;
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {
    convertpHyphensToUnderscores,
    hyphenatedToTilteCaseConcatenated,
    stripHyphens,
    uppercase,
    ...options,
  });
  await formatFiles(tree);
  await updateTsConfig(tree, options);
}

export default dxLibModuleGenerator;
