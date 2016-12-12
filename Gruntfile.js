const postCssProcessors = (grunt) => {
    var plugins = [
        require('autoprefixer')({
            browsers: 'last 2 versions'
        }),
        require("css-mqpacker")({
            sort: true
        })
    ]

    if (grunt.cli.tasks[0] === 'prod') {
        plugins.push(
            require('cssnano')
        )
    }

    return plugins
}

module.exports = (grunt)  => {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        watch: {
            example: {
                files: ['<%= paths.example.src %>/*.scss'],
                tasks: ['sass:example']
            },
            dev: {
                files: ['<%= paths.src %>/**/*.scss'],
                tasks: ['sass:dev', 'postcss:dev']
            },
            index: {
                files: ['template/**/*.html'],
                tasks: ['handlebarslayouts:index']
            }
        },
        sass: {
            example: {
                options: {
                    style: 'expanded',
                    loadPath: 'node_modules'
                },
                files: {
                    '<%= paths.example.dist %>/styles.css': '<%= paths.example.src %>/styles.scss'
                }
            },
            dev: {
                options: {
                    //style: 'expanded'
                },
                files: {
                    '<%= paths.dist %>/<%= pkg.name %>.css': '<%= paths.src %>/base.scss'
                }
            },
        },
        postcss: {
            options: {
                map: false,
                processors: postCssProcessors(grunt)
            },
            dev: {
                files: {
                    '<%= paths.dist %>/<%= pkg.name %>.css': '<%= paths.dist %>/<%= pkg.name %>.css'
                }
            },
            dist: {
                files: {
                    '<%= paths.dist %>/<%= pkg.name %>.min.css': '<%= paths.dist %>/<%= pkg.name %>.css'
                }
            }
        },
        handlebarslayouts: {
            index: {
                files: {
                    'example/index.html': 'template/index.html'
                },
                options: {
                    partials: [
                        'template/partials/*.html'
                    ],
                    modules: [
                        'template/helpers/helpers-*.js'
                    ]
                }
            }
        }
    })

    // Paths
    grunt.config.set('paths', {
        example: {
            src: 'example/css',
            dist: 'example/css'
        },
        src: 'src',
        dist: 'dist'
    })

    // Load Modules
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-sass')
    grunt.loadNpmTasks('grunt-postcss')
    grunt.loadNpmTasks("grunt-handlebars-layouts")

    // Create Tasks
    grunt.registerTask('dev', ['sass:dev', 'postcss:dev'])
    grunt.registerTask('prod', ['postcss:dist'])
}
