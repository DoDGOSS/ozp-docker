module.exports = function(grunt) {
    /* jshint camelcase: false */
    var sampleDataBase={
        "path":"data-schemas/mock",
        options: {
            directory: false,
            index: "index.json"
        }
    };

    var mockBackendMiddleware = function(connect, options, middlewares) {
        // inject a custom middleware into the array of default middlewares
        middlewares.unshift(function(req, res, next) {

            if (req.method !== 'PUT' && req.method !== 'POST' && req.method !== 'DELETE') {
                return next();
            }
            res.end('The ozp-iwc test backend drops all write actions.');
        });

        return middlewares;
    };

    // Project configuration.
    var config = {
        pkg: grunt.file.readJSON('package.json'),

        src: {
            common: [
                'src/js/common/initials.js',
                'bower_components/es5-shim/es5-shim.js',
                'bower_components/es5-shim/es5-sham.js',
                'bower_components/es6-promise/promise.js',
                'src/js/common/util.js',
                'src/js/common/**/*.js'
            ],
            metrics: [
                '<%= src.common %>',
                'src/js/metric/stats/sample.js',
                'src/js/metric/stats/binary_heap.js',
                'src/js/metric/stats/exponentiallyDecayingSample.js',
                'src/js/metric/stats/exponentiallyWeightedMovingAverage.js',
                'src/js/metric/baseMetric.js',
                'src/js/metric/types/*.js',
                'src/js/metric/registry.js'
            ],
            bus: [
                '<%= src.common %>',
                '<%= src.metrics %>',
                'src/js/bus/util/**/*.js',
                'src/js/bus/wiring/configLoading.js',

                'src/js/bus/policyAuth/**/*.js',

                'src/js/bus/packet/**.*.js',
                'src/js/bus/network/**/*.js',

                'src/js/bus/transport/participant/base.js',
                'src/js/bus/transport/participant/internal.js',
                'src/js/bus/transport/participant/sharedWorker.js',
                'src/js/bus/transport/participant/postMessage.js',
                'src/js/bus/transport/router.js',
                'src/js/bus/transport/**/*.js',

                'src/js/bus/api/*.js',
                'src/js/bus/api/endpoint/*.js',
                'src/js/bus/api/base/*.js',
                'src/js/bus/api/error/*.js',
                'src/js/bus/api/filter/*.js',
                'src/js/bus/api/**/*.js',

                'src/js/bus/wiring/support/**/*.js',
                'src/js/bus/wiring/init/base.js',
                'src/js/bus/wiring/init/default.js'
            ],
            client: [
                '<%= src.common %>',
                'src/js/client/**/*.js'
            ],
            testLib: [
                'test/lib/**/*.js',
                'test/mockParticipant/**/*.js'
            ],
            testUnit: [
                'test/tests/unit/mockObject.js',
                'test/tests/unit/**/*.js'
            ],
            testIntegrationClient: [
                'test/tests/client-integration/**/*.js'
            ],
            testIntegrationBus: [
                'test/tests/bus-integration/**/*.js'
            ],
            test: [
                '<%= src.testUnit %>',
                '<%= src.testIntegrationClient %>'
            ],
            debugger: [
                'bower_components/bootstrap/dist/boostrap.js',
                'bower_components/jquery/dist/jquery.js',
                'bower_components/angular/angular.js',
                'bower_components/vis/dist/vis.js',
                'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
                'bower_components/angular-ui-router/release/angular-ui-router.js',
                'bower_components/angular-ui-grid/ui-grid.js',
                'components/debugger/js/debugger.js',
                'components/debugger/**/*.js'
            ],
            debuggerCss: [
                'bower_components/bootstrap/dist/css/bootstrap.css',
                'bower_components/angular-ui-grid/ui-grid.css',
                'bower_components/vis/dist/vis.css',
                'components/debugger/css/**/*.css'
            ],
            workerTimerJs: [
                'src/js/worker/timerThrottleUnlock.js',
                'src/js/worker/timerThrottleUnlockRunner.js'
            ],
            all: [
                '<%= src.metrics %>',
                '<%= src.bus %>',
                '<%= src.client %>',
                '<%= src.debugger %>'
            ]
        },
        output: {
            busJs: 'dist/js/<%= pkg.name %>-bus.js',
            clientJs: 'dist/js/<%= pkg.name %>-client.js',
            metricsJs: 'dist/js/<%= pkg.name %>-metrics.js',
            ngBusJs: 'dist/js/<%= pkg.name %>-bus-angular.js',
            ngClientJs: 'dist/js/<%= pkg.name %>-client-angular.js',
            ngMetricsJs: 'dist/js/<%= pkg.name %>-metrics-angular.js',
            debuggerJs: 'dist/debugger/js/debuggerConcat.js',
            debuggerCss: 'dist/debugger/css/debugger.css',
            workerTimerJs: 'dist/js/ozpIwc.timer.js',

            busJsMin: 'dist/js/<%= pkg.name %>-bus.min.js',
            clientJsMin: 'dist/js/<%= pkg.name %>-client.min.js',
            metricsJsMin: 'dist/js/<%= pkg.name %>-metrics.min.js',
            ngBusJsMin: 'dist/js/<%= pkg.name %>-bus-angular.min.js',
            ngClientJsMin: 'dist/js/<%= pkg.name %>-client-angular.min.js',
            ngMetricsJsMin: 'dist/js/<%= pkg.name %>-metrics-angular.min.js',
            debuggerJsMin: 'dist/debugger/js/debuggerConcat.min.js',


            allJs: ['<%=output.busJs %>', '<%=output.clientJs %>', '<%=output.metricsJs %>',
                    '<%=output.ngBusJs %>', '<%=output.ngClientJs %>', '<%=output.ngMetricsJs %>'],
            allJsMin: ['<%=output.busJsMin %>', '<%=output.clientJsMin %>', '<%=output.metricsJsMin %>',
                       '<%=output.ngBusJsMin %>', '<%=output.ngClientJsMin %>', '<%=output.ngMetricsJsMin %>'],
            testUnit: [
                'test/lib/test.conf.js',
                '<%= output.busJsMin %>',
                'test/lib/testWiring.js',
                'test/lib/testTools.js',
                'test/lib/mockTime.js',
                'test/lib/jasmine-promises.js',
                'test/lib/mockObjects.js',
                '<%= src.testUnit %>'
            ],
            testIntegrationClient: [
                'test/lib/testTools.js',
                '<%= output.clientJs %>',
                'test/lib/jasmine-promises.js',
                'test/mockParticipant/js/mockParticipant.js',
                '<%= src.testIntegrationClient %>'
            ],
            testIntegrationBus: [
                '<%= output.busJs %>',
                '<%= src.testLib %>',
                '<%= src.testIntegrationBus %>'
            ]
        },
        concat_sourcemap: {
            options: {
                sourcesContent: true
            },
            bus: {
                src: '<%= src.bus %>',
                dest: '<%= output.busJs %>'
            },
            client: {
                src: '<%= src.client %>',
                dest: '<%= output.clientJs %>'
            },
            metrics: {
                src: '<%= src.metrics %>',
                dest: '<%= output.metricsJs %>'
            },
            debugger: {
                src: '<%= src.debugger %>',
                dest: '<%= output.debuggerJs %>'
            },
            workerTimer: {
                src: '<%= src.workerTimerJs %>',
                dest: '<%= output.workerTimerJs %>'
            },
            debuggerCss: {
                src: '<%= src.debuggerCss %>',
                dest: '<%= output.debuggerCss %>'
            }
        },
        concat: {
            ngBus: {
                options: {
                    banner: 'angular.module(\'ozpIwcBus\', []).factory(\'iwcBus\', function () {\n',
                    footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
                },
                src: '<%= output.busJs %>',
                dest: '<%= output.ngBusJs %>'
            },
            ngBusMin: {
                options: {
                    banner: 'angular.module(\'ozpIwcBus\', []).factory(\'iwcBus\', function () {\n',
                    footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
                },
                src: '<%= output.busJsMin %>',
                dest: '<%= output.ngBusJsMin %>'
            },
            ngClient: {
                options: {
                    banner: 'angular.module(\'ozpIwcClient\', []).factory(\'iwcClient\', function () {\n',
                    footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
                },
                src: '<%= output.clientJs %>',
                dest: '<%= output.ngClientJs %>'
            },
            ngClientMin: {
                options: {
                    banner: 'angular.module(\'ozpIwcClient\', []).factory(\'iwcClient\', function () {\n',
                    footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
                },
                src: '<%= output.clientJsMin %>',
                dest: '<%= output.ngClientJsMin %>'
            },
            ngMetrics: {
                options: {
                    banner: 'angular.module(\'ozpIwcMetrics\', []).factory(\'iwcMetrics\', function () {\n',
                    footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
                },
                src: '<%= output.metricsJs %>',
                dest: '<%= output.ngMetricsJs %>'
            },
            ngMetricsMin: {
                options: {
                    banner: 'angular.module(\'ozpIwcMetrics\', []).factory(\'iwcMetrics\', function () {\n',
                    footer: '\n//Return the ozpIwc object\nreturn ozpIwc;\n});'
                },
                src: '<%= output.metricsJsMin %>',
                dest: '<%= output.ngMetricsJsMin %>'
            }
        },
        uglify: {
            options: {
                sourceMap:true,
                sourceMapIncludeSources: true,
                sourceMapIn: function(m) { return m+".map";}
            },
            bus: {
                src: '<%= concat_sourcemap.bus.dest %>',
                dest: '<%= output.busJsMin %>'
            },
            client: {
                src: '<%= concat_sourcemap.client.dest %>',
                dest: '<%= output.clientJsMin %>'
            },
            metrics: {
                src: '<%= concat_sourcemap.metrics.dest %>',
                dest: '<%= output.metricsJsMin %>'
            },
            debugger: {
                src: '<%= concat_sourcemap.debugger.dest %>',
                dest: '<%= output.debuggerJsMin %>'
            }
        },

        // Copies minified and non-minified js into dist directory
        copy: {
            core: {
                files: [
                    {
                        src: ['**/*.html'],
                        dest: './dist/',
                        cwd: 'src/html',
                        expand: true,
                        nonull:true
                    },{
                        src: ['**/*'],
                        dest: './dist/js/src/js',
                        cwd: 'src/js',
                        expand: true,
                        nonull:true
                    },{
                        src: ['ozpIwc.conf.js', 'ozpIwc.loader.js'],
                        dest: './dist/js',
                        cwd: 'src/js',
                        expand: true,
                        nonull:true
                    }
                ]
            },
            debugger: {
                files: [
                    {
                        src: ['*'],
                        dest: './dist/debugger/fonts',
                        cwd: 'bower_components/bootstrap/dist/fonts',
                        expand: true,
                        nonull: true
                    },
                    {
                        src: ['*.eot', '*.svg', '*.ttf', '*.woff'],
                        dest: './dist/debugger/css',
                        cwd: 'bower_components/angular-ui-grid',
                        expand: true,
                        nonull: true
                    },
                    {
                        src: ['**/*.tpl.html'],
                        dest: './dist/debugger/templates',
                        cwd: 'components/debugger/js',
                        expand: true,
                        flatten: true,
                        nonull: true
                    }, {
                        src: ['**'],
                        dest: './dist/debugger/hal-browser',
                        cwd: 'bower_components/hal-browser',
                        expand: true,
                        nonull: true
                    }, {
                        src: ['favicon.ico'],
                        dest: './dist/debugger/',
                        cwd: 'components/debugger',
                        expand: true,
                        nonull: true
                    }, {
                        src: ['*.html'],
                        dest: './dist/debugger/',
                        cwd: 'components/debugger',
                        expand: true,
                        nonull: true
                    }
                ]
            },
            ghPages: {
                files: [
                    {
                        src: ['**/*', "!js/ozpIwc.conf.js"],
                        dest: 'gh-pages/',
                        cwd: 'dist/',
                        expand: true,
                        nonull:true
                    }
                ]
            },
            ghPagesVersioned: {
                files: [
                    {
                        src: ['**/*', "!js/ozpIwc.conf.js"],
                        dest: 'gh-pages/<%= pkg.version %>/',
                        cwd: 'dist/',
                        expand: true,
                        nonull:true
                    }
                ]
            },
            // concat_sourcemap on the boostrap.css wants to see the less files
            // munge the source a bit to give it what it wants
            hackBootstrap: {
                files: [
                    {
                        src: ['**/*'],
                        dest: 'bower_components/bootstrap/dist/css/less',
                        cwd: 'bower_components/bootstrap/less',
                        expand: true,
                        nonull:true
                    }
                ]
            }
        },
        clean: {
            dist: ['./dist/']
        },
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                options: {
                    paths: [
                        'src/js/'
                    ],
//                    themedir: 'path/to/custom/theme/',
                    outdir: 'dist/doc'
                }
            }
        },
        watch: {
            concatFiles: {
                files: ['Gruntfile.js', '<%= src.all %>','src/**/*'],
                tasks: ['jshint','concat_sourcemap', 'yuidoc','copy:core'],
                options: {
                    interrupt: true,
                    spawn: false
                }

            },
            test: {
                files: ['Gruntfile.js', 'dist/**/*', '<%= src.test %>'],
                options: {
                    livereload: true,
                    spawn: false
                }
            }
        },
        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= src.all %>',
                '!bower_components/**/*',
                '!src/js/client/timerThrottleUnlock.js',
                '!src/js/worker/timerThrottleUnlock.js'
            ],
            test: {
                src: ['<%= src.test %>']
            }
        },
        connect: {
            app: {
                options: {
                    port: 13000,
                    base: ['dist',sampleDataBase],
                    middleware:  mockBackendMiddleware
                }
            },
            tests: {
                options: {port: 14000, base: ["dist", "test",sampleDataBase, 'node_modules/jasmine-core/lib']}
            },
            mockParticipant: {
                options: {port: 14001, base: ["dist","test/mockParticipant"]}
            },
            testBus: {
                options:{ port: 14002, base: ['dist',sampleDataBase], middleware:  mockBackendMiddleware}
            },
            noDB: {
                options: {port: 16000, base: ["dist"]}
            },
            demo1: {
                options: { port: 15000, base: ["dist","demo/bouncingBalls"] }
            },
            demo2: {
                options: { port: 15001, base: ["dist","demo/bouncingBalls"] }
            },
            demo3: {
                options: { port: 15002, base: ["dist","demo/bouncingBalls"] }
            },
            demo4: {
                options: { port: 15003, base: ["dist","demo/bouncingBalls"] }
            },
            gridsterDemo: {
                options: { port: 15004, base: ["dist","demo/gridster"] }
            },
            intentsDemo: {
                options:{	port: 15006, base: ["dist","demo/intentDemo","test/tests/unit"]}
            },
            performanceTester: {
                options:{	port: 15007, base: ["dist","demo/performanceTester"]}
            }
        },
        dist: {

        },
        bump: {
            options: {
                files: [
                    'package.json',
                    'bower.json'
                ],
                commit: false,
                createTag: false,
                push: false
            }
        },
        shell: {
            buildVersionFile: {
                command: [
                    'echo "Version: <%= pkg.version %>" > dist/version.txt',
                    'echo "Git hash: " >> dist/version.txt',
                    'git rev-parse HEAD >> dist/version.txt',
                    'echo Date: >> dist/version.txt',
                    'git rev-parse HEAD | xargs git show -s --format=%ci >> dist/version.txt'
                ].join('&&')
            },
            releaseGit: {
                command: [
                    'git add bower.json package.json',
                    'git commit -m "chore(release): <%= pkg.version %>"',
                    'git push origin master',
                    'git checkout --detach',
                    'grunt build yuidoc',
                    'git add -f dist',
                    'git commit -m "chore(release): <%= pkg.version %>"',
                    'git tag -a "<%= pkg.version %>" -m "chore(release): <%= pkg.version %>"',
                    'git tag -a "release/<%= pkg.version %>" -m "chore(release): <%= pkg.version %>"',
                    'git push origin <% pkg.version %> --tags',
                    'grunt update-gh-pages',
                    'git checkout dist',
                    'git checkout master'
                ].join('&&')
            },
            tarDate: {
                command: [
                    './packageRelease.sh iwc-prod dist'
                ].join('&&')
            },
            tarVersion: {
                command: [
                    './packageRelease.sh iwc-prod dist <%= pkg.version %>'
                ].join('&&')
            }
        },
        karma: {
            options:{
                browsers: ['PhantomJS']
            },
            unit: {
                options: {
                    configFile: 'karma-unit.conf.js'
                },
                files: {
                    src: ['<%= output.testUnit %>']
                }
            },
            integrationClient: {
                files: {
                    src: ['<%= output.testIntegrationClient %>']
                }
            },
            integrationBus: {
                files: {
                    src: ['<%= output.testIntegrationBus %>']
                },
                proxies: {
                    '/js/ozpIwc-bus.js': '/base/dist/js/ozpIwc-bus.js'
                }
            }
        },
        nodemon: {
            backend: {
                script: 'server.js',
                options: {
                    env:{
                        PORT: "8181"
                    },
                    cwd: 'components/backend',
                    ignore: ['node_modules/**']
                }
            }
        },
        concurrent: {
            server: {
                tasks: ['nodemon','build','watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        },
        gitbook: {
            development: {
                output: "gh-pages/<%= pkg.version %>/gitbook",
                input: "./docs/iwc_guide",
                title: "Inter-Window Communication (IWC)",
                github: "ozone-development/ozp-iwc"
            }
        },
        'gh-pages': {
            options: {
                base: "gh-pages",
                add: true
            },
            src: ["**"]
        }

    };

    // load all grunt tasks matching the `grunt-*` pattern
    require('load-grunt-tasks')(grunt);

    grunt.initConfig(config);

    grunt.registerTask('readpkg', 'Read in the package.json file', function() {
        grunt.config.set('pkg', grunt.file.readJSON('./package.json'));
    });
    // Default task(s).
    grunt.registerTask('build', "Concat and minify the source code into dist",
        ['copy:hackBootstrap', 'jshint', 'concat_sourcemap','uglify','concat', 'yuidoc', 'copy:core', 'copy:debugger']
    );
    grunt.registerTask('karmaTests', "Runs the unit and integration tests.",
        ['build','karma:unit','connect:testBus','connect:mockParticipant', 'karma:integrationClient', 'karma:integrationBus']
    );
    grunt.registerTask('travis', "Build, Runs the unit tests, and create Docs",
        ['build','karma:unit', 'yuidoc']
    );
    grunt.registerTask('dist', "Builds and tests the full distribution",
        ['build','karmaTests','yuidoc']
    );
    grunt.registerTask('connect-tests', "Runs the tests locally for in-browser testing",
        ['build','connect:tests','connect:testBus','connect:mockParticipant', 'watch']
    );
    grunt.registerTask('connect-all', "Runs tests and demos locally",
        ['build','connect','watch']
    );
    grunt.registerTask('connect-noDB', "Runs tests and demos locally",
        ['build','connect:noDB','watch']
    );
    grunt.registerTask('serve', "Launches the IWC & Backend",
        ['concurrent:server']
    );
    grunt.registerTask('releasePatch',
        ['build','karma:unit','bump:patch','readpkg','shell:releaseGit']
    );
    grunt.registerTask('releaseMinor',
        ['build','karma:unit','bump:minor','readpkg', 'shell:releaseGit']
    );
    grunt.registerTask('releaseMajor',
        ['build','karma:unit','bump:major','readpkg', 'shell:releaseGit']
    );
    grunt.registerTask('update-gh-pages',
        ['build', 'copy:ghPages', 'copy:ghPagesVersioned', 'gitbook', 'gh-pages']
    );
    grunt.registerTask('default',
        ['dist']
    );

};
