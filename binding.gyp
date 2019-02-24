{
  'targets' :
  [
    {
      'target_name' : 'ifx_njs_bind',

      'sources' :
      [
        'src/odbc.cpp',
        'src/odbc_connection.cpp',
        'src/odbc_statement.cpp',
        'src/odbc_result.cpp',
        'src/dynodbc.cpp'
      ],

      'include_dirs':
      [
        "<!(node -e \"require('nan')\")"
      ],

      'defines' :
      [
        #'UNICODE',
        'ODBC64'
      ],

    "variables":
    {
        # Set the linker location,
		"ORIGIN_LIB_PATH%": "$(CSDK_HOME)/lib/cli",
    },


    'conditions' :
    [
        ############### Linux 32bit #################
        [ 'OS == "linux" and target_arch =="ia32" ',
        {
          'conditions' :
          [

          ],


          'libraries' :
          [
                '-L$(CSDK_HOME)/lib/cli',
                '-lthcli'
          ],


          'include_dirs':
          [
                '$(CSDK_HOME)/incl/cli'
          ],


          'cflags' :
          [
            "-g "
          ],
        }
        ],

        ############### Linux ARM #################
        [ 'OS == "linux" and target_arch =="arm" ',
        {
          'conditions' :
          [

          ],


          'libraries' :
          [
                '-L$(CSDK_HOME)/lib/cli',
                '-lthcli'
          ],


          'include_dirs':
          [
                '$(CSDK_HOME)/incl/cli'
          ],


          'cflags' :
          [
            "-g "
          ],
        }
        ],

        ############### Linux 64bit #################
        [ 'OS == "linux" and target_arch =="x64" ',
        {
          'conditions' :
          [
          ],

          'libraries' :
          [
                '-L$(CSDK_HOME)/lib/cli ',
                '-lthcli'
          ],

          'include_dirs':
          [
                '$(CSDK_HOME)/incl/cli'
           ],

          'cflags' :
          [
            "-g -m64"
          ],
        }
        ],

        ############### MAC 64bit #################
        [ 'OS == "mac" and target_arch =="x64" ',
        {
           'xcode_settings':
           {
                'GCC_ENABLE_CPP_EXCEPTIONS': 'YES',
           },

           'libraries' :
           [
                '-L$(CSDK_HOME)/lib/cli ',
                '-lthcli'
           ],
           'include_dirs':
           [
                '$(CSDK_HOME)/incl/cli'
           ],
           'cflags' :
           [
                "-g "
           ]
        }],

        ############### Win 32bit #################
        [ 'OS=="win" and target_arch =="ia32"',
        {
          'sources' :
          [
            'src/strptime.c',
            'src/odbc.cpp'
          ],

          'libraries':
          [
               '$(CSDK_HOME)/lib/iclit09b.lib',
          ],

          'include_dirs':
          [
            '$(CSDK_HOME)/incl/cli;',
            '$(NODE_SRC)/test/gc/node_modules/nan'
          ],
        }
        ],

        ############### Win 64bit #################
        [ 'OS=="win" and target_arch =="x64"',
        {
          'sources' :
          [
            'src/strptime.c',
            'src/odbc.cpp'
          ],

          'libraries':
          [
               '$(CSDK_HOME)/lib/iclit09b.lib',
          ],

          'include_dirs':
          [
            '$(CSDK_HOME)/incl/cli;',
            '$(NODE_SRC)/test/gc/node_modules/nan'
          ],
        }
        ],

        ############### Undefined 32bit OS #################
        [ 'OS != "linux" and OS!="win" and OS!="darwin" and target_arch =="ia32" ',
        {
          'conditions' :
          [
          ],
          'libraries' :
          [
                '-L$(CSDK_HOME)/lib/cli ',
                '-lthcli'
          ],
          'include_dirs':
          [
                '$(CSDK_HOME)/incl/cli'
          ],
          'cflags' :
          [
            "-g "
          ],
        }
        ],

        ############### Undefined 64bit OS #################
        [ 'OS != "linux" and OS != "win" and OS != "darwin" and target_arch == "x64" ',
        {
          'conditions' :
          [
          ],
          'libraries' :
          [
                '-L$(CSDK_HOME)/lib/cli ',
                '-ldb2'
          ],
          'include_dirs':
          [
                '$(CSDK_HOME)/incl/cli'
          ],
          'cflags' :
          [
            "-g "
          ],
        }
        ]

      ]
    }
  ]
}
