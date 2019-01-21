import typescript from 'rollup-plugin-typescript2';

export default {
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
