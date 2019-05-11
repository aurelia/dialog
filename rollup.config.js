import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/aurelia-dialog.ts',
    output: [
      {
        dir: 'dist/es2015',
        format: 'esm'
      }
    ],
    plugins: [
      typescript({
        cacheRoot: '.rollupcache',
        tsconfigOverride: {
          compilerOptions: {
            target: 'es2015',
            removeComments: true,
          }
        }
      })
    ]
  },
  {
    input: 'src/aurelia-dialog.ts',
    output: [{
      dir: 'dist/es2017',
      format: 'esm'
    }],
    plugins: [
      typescript({
        cacheRoot: '.rollupcache',
        tsconfigOverride: {
          compilerOptions: {
            target: 'es2017',
            removeComments: true,
          }
        }
      })
    ]
  },
  {
    input: 'src/aurelia-dialog.ts',
    output: [
      { dir: 'dist/amd', format: 'amd', id: 'aurelia-dialog' },
      { dir: 'dist/commonjs', format: 'cjs' },
      { dir: 'dist/system', format: 'system' },
      { dir: 'dist/native-modules', format: 'esm' },
    ],
    plugins: [
      typescript({
        cacheRoot: '.rollupcache',
        tsconfigOverride: {
          compilerOptions: {
            target: 'es5',
            removeComments: true,
          }
        }
      })
    ]
  },
  {
    input: './src/aurelia-dialog.ts',
    external: [
      'aurelia-framework',
      'aurelia-binding',
      'aurelia-templating',
      'aurelia-dependency-injection',
      'aurelia-pal'
    ],
    output: [
      {
        file: 'dist/umd/aurelia-dialog.js',
        format: 'umd',
        name: 'au.dialog',
        globals: {
          'aurelia-framework': 'au',
          'aurelia-binding': 'au',
          'aurelia-templating': 'au',
          'aurelia-dependency-injection': 'au',
          'aurelia-pal': 'au'
        },
        esModule: false
      }
    ],
    inlineDynamicImports: true,
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'esnext',
            outDir: undefined,
            target: 'es5',
            declaration: false,
            removeComments: true
          },
          include: [
            'src'
          ]
        },
        cacheRoot: '.rollupcache'
      })
    ]
  },
  {
    input: './src/aurelia-dialog.ts',
    external: [
      'aurelia-framework',
      'aurelia-binding',
      'aurelia-templating',
      'aurelia-dependency-injection',
      'aurelia-pal'
    ],
    output: [
      {
        file: 'dist/umd-es2015/aurelia-dialog.js',
        format: 'umd',
        name: 'au.dialog',
        globals: {
          'aurelia-framework': 'au',
          'aurelia-binding': 'au',
          'aurelia-templating': 'au',
          'aurelia-dependency-injection': 'au',
          'aurelia-pal': 'au'
        },
        esModule: false
      }
    ],
    inlineDynamicImports: true,
    plugins: [
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'esnext',
            outDir: undefined,
            target: 'es2015',
            declaration: false,
            removeComments: true
          },
          include: [
            'src'
          ]
        },
        cacheRoot: '.rollupcache'
      })
    ]
  }
].map(config => {
  config.external = [
    'aurelia-binding',
    'aurelia-dependency-injection',
    'aurelia-pal',
    'aurelia-templating',
    'aurelia-dialog',
    'aurelia-task-queue',
    'aurelia-logging',
    'aurelia-path',
    'aurelia-loader',
    'aurelia-metadata'
  ];
  config.output.forEach(output => output.sourcemap = true);
  config.output.forEach(output => output.chunkFileNames = '[name].js');
  return config;
});

