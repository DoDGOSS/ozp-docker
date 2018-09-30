'use strict';
/**
 * Changelog (changes from master branch https://github.com/ngbp/ngbp)
 *
 * - modification to jshint linting configuration
 * - removed vendor_files.css from index.build.src and index.compile.src, due
 *    to this issue: https://github.com/ngbp/ngbp/issues/57
 * - added cssmin to do css compression instead of using less plugin. had issue
 *    where the compile task would wipe out vendor css from the concat'ed file.
 *    Removed the entire less:compile task/target.
 * - added grunt-contrib-connect to support (manually) serving the app via
 *    grunt connect:test:keepalive (or similar)
 * - added 'serve' task using grunt connect
 * - delta:less also needs to run the concat:build_css task
 * - added grunt-gh-pages
 * - added YUIdoc generation
 * - added grunt release task for running changelog and bump
 */


module.exports = function(grunt) {

  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-gh-pages');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-shell');


  /**
   * Load in our build configuration file.
   */
  var userConfig = require('./build.config.js');

  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON('package.json'),

    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    /**
     * Creates a changelog on a new version.
     */
    changelog: {
      options: {
        dest: 'CHANGELOG.md',
        version: '<%= pkg.version %>'
          // maybe use this again later, but for now, just set version manually
          // in bower.json and package.json
          // version: '<%= changelogVersion %>'
      }
    },

    /**
     * Increments the version number, etc.
     */
    bump: {
      options: {
        files: [
          'package.json'
        ],
        commit: true,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          'package.json',
          'bower.json',
          'CHANGELOG.md'
        ],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    /**
     * The directories to delete when `grunt clean` is executed.
     */
    clean: [
      '<%= build_dir %>',
      '<%= compile_dir %>',
      '<%= docs_dir %>',
      '<%= cov_dir %>'
    ],

    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build_dir`, and then to copy the assets to `compile_dir`.
     */
    copy: {
      build_app_assets: {
        files: [{
          src: ['**'],
          dest: '<%= build_dir %>/assets/',
          cwd: 'src/assets',
          expand: true
        }]
      },
      build_vendor_assets: {
        files: [{
          src: ['*.svg'],
          dest: '<%= build_dir %>/assets/svg/',
          cwd: 'vendor/icons/dist/css/svg',
          expand: true,
          flatten: true
        },{
          src: ['<%= vendor_files.font %>'],
          dest: '<%= build_dir %>/assets/fonts/',
          flatten: true,
          cwd: '.',
          expand: true
        }]
      },
      // jquery-ui doesn't support LESS so there's no way to easily override
      // the image path references in the css, hence this manual copy
      build_jquery_ui_images: {
        files: [{
          src: ['vendor/jquery-ui/themes/ui-darkness/images/*'],
          dest: '<%= build_dir %>/assets/images/',
          cwd: '.',
          expand: true,
          flatten: true
        }]
      },
      build_appjs: {
        files: [{
          src: ['<%= app_files.js %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }, {
          src: ['OzoneConfig.js'],
          dest: '<%= build_dir %>',
          cwd: 'src/',
          expand: true
        }]
      },
      build_vendorjs: {
        files: [{
          src: ['<%= vendor_files.js %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      compile_assets: {
        files: [{
          src: ['**'],
          dest: '<%= compile_dir %>/assets',
          cwd: '<%= build_dir %>/assets',
          expand: true
        }, {
          src: ['OzoneConfig.js'],
          dest: '<%= compile_dir %>',
          cwd: 'src',
          expand: true
        }]
      },
      docs: {
        files: [{
          src: ['**'],
          dest: '<%= build_dir %>/docs',
          cwd: '<%= docs_dir %>',
          expand: true
        }]
      },
      // so that they're deployed on gh-pages
      tools: {
        files: [{
          src: ['**'],
          dest: '<%= build_dir %>/tools',
          cwd: 'tools',
          expand: true
        }]
      }
    },

    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */
    concat: {
      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      build_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'module.suffix'
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    /**
     * `grunt coffee` compiles the CoffeeScript sources. To work well with the
     * rest of the build, we have a separate compilation task for sources and
     * specs so they can go to different places. For example, we need the
     * sources to live with the rest of the copied JavaScript so we can include
     * it in the final build, but we don't want to include our specs there.
     */
    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: ['<%= app_files.coffee %>'],
        dest: '<%= build_dir %>',
        ext: '.js'
      }
    },

    /**
     * `ng-min` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    ngmin: {
      compile: {
        files: [{
          src: ['<%= app_files.js %>'],
          cwd: '<%= build_dir %>',
          dest: '<%= build_dir %>',
          expand: true
        }]
      }
    },

    /**
     * Minify the sources!
     */
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    /**
     * `grunt-sass` handles our SASS compilation and uglification automatically.
     * Only our `main.sass` file is included in compilation; all other files
     * must be imported from this file.
     */
    sass: {
      options: {
        style: 'expanded'
      },
      dist: {
        files: {
          // '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css':'<%= app_files.scss %>'
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css':'src/sass/main.scss'
        }
      }
    },

    /**
     * cssmin compresses css files
     */
    cssmin: {
      css: {
        src: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css',
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      }
    },

    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        'node': true,
        'browser': true,
        'esnext': true,
        'bitwise': true,
        'camelcase': false, // ARW: angularjs uses variables like _$provider_ that will fail this test
        'curly': true,
        'eqeqeq': true,
        'immed': true,
        'indent': 2,
        'latedef': true,
        'newcap': true,
        'noarg': true,
        'quotmark': 'single',
        'regexp': true,
        'undef': true,
        'unused': true,
        'strict': true,
        'trailing': true,
        'smarttabs': true,
        'globals': {
          'angular': false,
          'describe': false,
          'beforeEach': false,
          'inject': false,
          'it': false,
          'xit': false,
          'expect': false,
          'jasmine': false,
          '$scope': false,
          'alert': false,
          '$state': false,
          'spyOn': false,
          '$': false,
          'getJSONFixture': false
        }
      }
    },

    /**
     * `coffeelint` does the same as `jshint`, but for CoffeeScript.
     * CoffeeScript is not the default in ngBoilerplate, so we're just using
     * the defaults here.
     */
    coffeelint: {
      src: {
        files: {
          src: ['<%= app_files.coffee %>']
        }
      },
      test: {
        files: {
          src: ['<%= app_files.coffeeunit %>']
        }
      }
    },

    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
    html2js: {
      /**
       * These are the templates from `src/app`.
       */
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= app_files.atpl %>'],
        dest: '<%= build_dir %>/templates-app.js'
      },

      /**
       * These are the templates from `src/common`.
       */
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= app_files.ctpl %>'],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },
    'gh-pages': {
      options: {
        base: 'build'
      },
      src: '**/*'
    },
    // Grunt server setup
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: 35729,
        middleware: function(connect, options, middlewares) {
          middlewares.unshift(function(req, res, next) {
              res.setHeader('X-Frame-Options', 'SAMEORIGIN');
              next();
          });
          return middlewares;
        }
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= build_dir %>/assets/mock',
            '<%= build_dir %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '<%= build_dir %>/assets/mock',
            '<%= build_dir %>'
          ]
        }
      },
      production: {
        options: {
          port: 9037,
          keepalive: true,
          base: ['<%= compile_dir %>', '<%= compile_dir %>/assets/mock']
        }
      },
      // Documentation server
      docs: {
        options: {
          port: 9010,
          base: '<%= docs_dir %>',
          middleware: function(connect, options, middlewares) {
            middlewares.unshift(function(req, res, next) {
                res.setHeader('X-Frame-Options', 'SAMEORIGIN');
                next();
            });
            return middlewares;
          }
        }
      },
      // Coverage report server
      cov: {
        options: {
          port: 9009,
          base: '<%= cov_dir %>'
        }
      },
      devIndex: {
        options: {
          port: 9100,
          base: './tools'
        }
      },
      // ozp test utility
      ozpDataUtility: {
        options: {
          port: 9600,
          hostame: 'localhost',
          base: ['tools/ozpDataUtility', '.'],
          keepalive: true
        }
      },
      // sticky state demo
      stickyStateDemo: {
        options: {
          port: 9601,
          hostame: 'localhost',
          base: ['tools/stickyStateDemo', '.'],
          keepalive: true
        }
      }
    },

    /**
     * The Karma configurations.
     */
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        port: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },

    /**
     * The `index` task compiles the `index.html` file as a Grunt template. CSS
     * and JS files co-exist here but they get split apart later.
     */
    index: {

      /**
       * During development, we don't want to have wait for compilation,
       * concatenation, minification, etc. So to avoid these steps, we simply
       * add all script files directly to the `<head>` of `index.html`. The
       * `src` property contains the list of included files.
       */
      build: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          //'<%= vendor_files.css %>', // ARW
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },

      /**
       * When it is time to have a completely compiled application, we can
       * alter the above to include only a single JavaScript and a single CSS
       * file. Now we're back!
       */
      compile: {
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          // '<%= vendor_files.css %>', // ARW
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },

    /**
     * This task compiles the karma template so that changes to its file array
     * don't have to be managed manually.
     */
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= test_files.js %>'
        ]
      }
    },
    /**
     * create a version.txt file in the build and release dirs
     *
     * tars and compresses build/ and bin/ dirs for release
     */
    shell: {
      buildVersionFile: {
        command: [
          'echo "Version: <%= pkg.version %>" > <%= build_dir %>/version.txt',
          'echo "Git hash: " >> <%= build_dir %>/version.txt',
          'git rev-parse HEAD >> <%= build_dir %>/version.txt',
          'echo Date: >> <%= build_dir %>/version.txt',
          'git rev-parse HEAD | xargs git show -s --format=%ci >> <%= build_dir %>/version.txt'
        ].join('&&')
      },
      compileVersionFile: {
        command: [
          'echo "Version: <%= pkg.version %>" > <%= compile_dir %>/version.txt',
          'echo "Git hash: " >> <%= compile_dir %>/version.txt',
          'git rev-parse HEAD >> <%= compile_dir %>/version.txt',
          'echo Date: >> <%= compile_dir %>/version.txt',
          'git rev-parse HEAD | xargs git show -s --format=%ci >> <%= compile_dir %>/version.txt'
        ].join('&&')
      },
      tarDevVersion: {
        command: [
          './packageRelease.sh webtop-dev build <%= pkg.version %>'
        ].join('&&')
      },
      tarProdVersion: {
        command: [
          './packageRelease.sh webtop-prod bin <%= pkg.version %>'
        ].join('&&')
      },
      tarDevDate: {
        command: [
          './packageRelease.sh webtop-dev build'
        ].join('&&')
      },
      tarProdDate: {
        command: [
          './packageRelease.sh webtop-prod bin'
        ].join('&&')
      }
    },
    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        url: '<%= pkg.homepage %>',
        options: {
          //paths: [ '<%= app_files.js %>' ],
          paths: './src',
          themedir: 'node_modules/yuidoc-bootstrap-theme',
          helpers: ['node_modules/yuidoc-bootstrap-theme/helpers/helpers.js'],
          outdir: '<%= docs_dir %>'
        }
      }
    },

    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
    delta: {
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the Gruntfile changes, we just want to lint it. In fact, when
       * your Gruntfile changes, it will automatically be reloaded!
       */
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: false
        }
      },

      /**
       * When our JavaScript source files change, we want to run lint them, build docs and
       * run our unit tests.
       */
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: ['jshint:src', 'karma:unit:run', 'copy:build_appjs', 'yuidoc']
      },

      /**
       * When our CoffeeScript source files change, we want to run lint them and
       * run our unit tests.
       */
      coffeesrc: {
        files: [
          '<%= app_files.coffee %>'
        ],
        tasks: ['coffeelint:src', 'coffee:source', 'karma:unit:run', 'copy:build_appjs']
      },

      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: ['copy:build_app_assets', 'copy:build_vendor_assets']
      },

      /**
       * When index.html changes, we need to compile it.
       */
      html: {
        files: ['<%= app_files.html %>'],
        tasks: ['index:build']
      },

      /**
       * When our templates change, we only rewrite the template cache.
       */
      tpls: {
        files: [
          '<%= app_files.atpl %>',
          '<%= app_files.ctpl %>'
        ],
        tasks: ['html2js']
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      sass: {
        files: ['src/**/*.scss'],
        tasks: ['sass', 'concat:build_css']
      },

      /**
       * When a JavaScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: ['jshint:test', 'karma:unit:run'],
        options: {
          livereload: false
        }
      },

      /**
       * When a CoffeeScript unit test file changes, we only want to lint it and
       * run the unit tests. We don't want to do any live reloading.
       */
      coffeeunit: {
        files: [
          '<%= app_files.coffeeunit %>'
        ],
        tasks: ['coffeelint:test', 'karma:unit:run'],
        options: {
          livereload: false
        }
      }

    }
  };

  // TODO: why this funky syntax? Just to combine two JS objects ... ?
  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', ['build', 'karma:unit', 'delta']);

  /**
   * The default task is to build and compile.
   */
  grunt.registerTask('default', ['build', 'compile']);

  /**
   * The `build` task gets your app ready to run for development and testing.
   *
   * - remove build_dir and compile_dir directories
   * - convert html template files to JS strings so they can be added to
   *    AngularJS's template cache, and thus loaded on the initial (and singular)
   *    server request. Adds templates-app.js and templates-common.js to
   *    build_dir/
   * - run jshint linter on all .js files in src/
   * - run coffeelint on all .coffee files in src/
   * - compile sass file (src/sass/main.scss) into css in file
   *    build_dir/assets/<pkg.name>-<pkg.version>.css (also compresses by removing
   *    spaces and cleans by running clean-css)
   * - compile YUIdoc documentation from source
   * - concats (adds) vendor css to build_dir/assets/<pkg.name>-<pkg.version>.css
   * - copy src/assets to build_dir/assets (images, fonts, etc)
   * - copy and flatten any vendor assets (defined in build.config.js) to
   *    build_dir/assets
   * - copy all non-spec JS files from src/ (excluding src/assets) to build_dir,
   *    maintaining the same directory structure
   * - copy all vendor JS files (defined in build.config.js) to build_dir/,
   *    maintaining the same directory structure
   * - compile index.html, adding the JS and CSS files to the page. After
   *    compilation, put this file in build_dir/
   * - compile the karma configuration file (we use grunt templates so we don't
   *    have to modify the file when adding new tests). The compiled configuration
   *    is copied to build_dir/karma-unit.js
   * - use karma to run all tests in 'singleRun' mode, which will launch the
   *    specified browser(s), run the tests, and close the browser(s)
   */
  grunt.registerTask('build', [
    'clean', 'html2js', 'jshint', 'coffeelint', 'coffee', 'sass', 'yuidoc',
    'concat:build_css', 'copy:build_app_assets', 'copy:build_vendor_assets',
    'copy:build_jquery_ui_images', 'copy:build_appjs', 'copy:build_vendorjs',
    'copy:docs', 'copy:tools', 'index:build'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   *
   * - compress/minify the concatenated css file
   *  (same as sass task, but with css compression and minification)
   * - copy build_dir/assets to compile_dir/assets
   * - run ngmin (pre-minification for AngularJS) - https://github.com/btford/ngmin
   *    Runs over all JS files in src/ other than tests and assets and puts them
   *    back in the same place in the build_dir
   * - concat all JS (vendor and app) into a single file compile_dir/<pkg.name>-<pkg.version>.js
   * - run UglifyJS on the file we just created (compile_dir/<pkg.name>-<pkg.version>.js)
   * - compile index.html with three files: the uglified js file above,
   *    vendor css (in build.config.js), and build_dir/assets/<pkg.name>-<pkg.version>.css
   */
  grunt.registerTask('compile', [
    'cssmin', 'copy:compile_assets', 'ngmin', 'concat:compile_js', 'uglify',
    'index:compile'
  ]);

  grunt.registerTask('serve', [
    'build', 'connect:livereload', 'connect:docs', 'connect:cov', 'connect:devIndex', 'watch'
  ]);

  // Run production version of the application
  grunt.registerTask('run', [
    'connect:production'
  ]);

  /**
   * Release a new version
   *
   * Runs grunt changelog to generate the changelog (assigning all commits from
   * the last tag to HEAD to the next version number) then runs grunt bump to
   * increment the version number, commit the change log and version update,
   * and create a new tag
   *
   * type param must be either patch, minor, or major
   */
  grunt.registerTask('release', 'Create a new release', function(type) {
    if (arguments.length !== 1) {
      grunt.log.writeln('ERROR, must specify a release type of patch, minor, or major');
      return;
    }
    var validTypes = ['patch', 'minor', 'major'];
    if (validTypes.indexOf(type) === -1) {
      grunt.log.writeln('ERROR: Invalid release type ' + type);
      return;
    }

    if (!setChangelogVersion(type)) {
      grunt.log.writeln('ERROR: Failed to set next version number for changelog');
      return;
    }
    grunt.task.run(['changelog']);
    grunt.task.run(['bump:' + type]);
  });

  /**
   * A utility function to get all app JavaScript sources.
   */
  function filterForJS(files) {
    return files.filter(function(file) {
      return file.match(/\.js$/);
    });
  }

  /**
   * A utility function to get all app CSS sources.
   */
  function filterForCSS(files) {
    return files.filter(function(file) {
      return file.match(/\.css$/);
    });
  }

  /**
   * Utility function to set the version to use for the changelog
   *
   * releaseType: 'patch', 'minor', or 'major'
   */
  function setChangelogVersion(releaseType) {
    var version = grunt.config('pkg.version').split('.');
    var major = version[0];
    var minor = version[1];
    var patch = version[2].split('-')[0];
    var newVersion = '';

    if (releaseType === 'patch') {
      var newPatchVersion = (Number(patch) + 1).toString();
      // existing major and minior versions stay the same, increment patch
      newVersion = major + '.' + minor + '.' + newPatchVersion;
      grunt.config('changelogVersion', newVersion);
      return true;
    } else if (releaseType === 'minor') {
      var newMinorVersion = (Number(minor) + 1).toString();
      // existing major version stays the same, increment minor version, reset
      // patch version to 0
      newVersion = major + '.' + newMinorVersion + '.0';
      grunt.config('changelogVersion', newVersion);
      return true;
    } else if (releaseType === 'major') {
      var newMajorVersion = (Number(major) + 1).toString();
      // increment major version, reset minor and patch versions to 0
      newVersion = newMajorVersion + '.0.0';
      grunt.config('changelogVersion', newVersion);
      return true;
    } else {
      console.log('ERROR: invalid releaseType: ' + releaseType);
      return false;
    }
  }

  /**
   * The index.html template includes the stylesheet and javascript sources
   * based on dynamic names calculated in this Gruntfile. This task assembles
   * the list into variables for the template to use and then runs the
   * compilation.
   */
  grunt.registerMultiTask('index', 'Process index.html template', function() {
    var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');
    var jsFiles = filterForJS(this.filesSrc).map(function(file) {
      return file.replace(dirRE, '');
    });
    var cssFiles = filterForCSS(this.filesSrc).map(function(file) {
      return file.replace(dirRE, '');
    });

    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function(contents) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version')
          }
        });
      }
    });
  });

  /**
   * In order to avoid having to specify manually the files needed for karma to
   * run, we use grunt to manage the list for us. The `karma/*` files are
   * compiled as grunt templates for use by Karma. Yay!
   */
  grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function() {
    var jsFiles = filterForJS(this.filesSrc);

    grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
      process: function(contents) {
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });

};
