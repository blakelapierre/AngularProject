Reference
=========

Application
------------
````
application-name {
  /* modules */
}
````

Module
------
````
module-name {
  /* elements */
}
````
Element
-------

Components/Directives
_____________________

````
components {                  directives {                  # {
  component-name-1              directive-name-1              name-1
  component-name-2    *or.      directive-name-2    *or.      name-2
  /* ... */                     /* ... */                     /* ... */
}                             }                             }
````

Components/Directives may also be nested inside others:
````
# {
  video-player {
    screen {
      stats
      content
    }
    controls
  }
}
````
Note: All component/directive names within a *module* must be unique. The nesting does not create a new namespace.



Factories/Services
__________________
````
factories {                 ^ {
  factory-name-1              factory-name-1
  factory-name-2    *or.      factory-name-2
  /* ... */                   /* ... */
}                           }
````


Routes
______
````
routes {                     => {                         > {
  '/': welcome                 '/': welcome                 '/': welcome
  '/user/:name': user   *or.   '/user/:name': user   *or.   '/user/:name': user
  '<path>': <# name>           '<path>': <# name>           '<path>': <# name>
  /* ... */                    /* ... */                    /* ... */
}                            }                            }
````


Example
-------
````
2016-fantasy {
  data-store {
    ^ {
      data-store
    }
  }

  devbox {}

  presidential {
    < {
      ngRoute   :angular-route
      ngAnimate :angular-animate
      ngTouch   :angular-touch

      data-store
      devbox
      state
      state-graph
      ui-components
    }

    # {
      presidential {
        welcome
        candidates
        league
        find-league
        new-league {
          construct
          draft
          selection {
            pasture
            stable
            set-draft
          }
          sidebar {
            players {
              invite
            }
          }
        }
      }
    }

    > {
      '/' : welcome
      '/candidates': candidates
      '/league/new': new-league
      '/league/find': find-league
      '/league/:leagueId': league
    }

    config
  }

  state {
    ^ {state {nested}}
  }

  state-graph {
    # {stage}
  }

  ui-components {
    directives {
      delayed-src
      scroll
      scrollControl
      scrollSync
      scrollSwap
      sensitiveTouch
    }
  }
}
````