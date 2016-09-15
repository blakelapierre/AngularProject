export default
`AngularProject {
  Application = name Contained<Module*>

  Module = name Contained<ModuleElement*>

  ModuleElement = Requirements
                | Components
                | Factories
                | Routes
                | Configs

  Requirements = RequirementsGlyph Contained<Requirement*>
  Components = ComponentsGlyph Contained<Component*>
  Factories = FactoriesGlyph Contained<Factory*>
  Routes = RoutesGlyph Contained<Route*>

  Configs = "config" Contained<Config*>?

  RequirementsGlyph = "requires"
                    | "<="
                    | "<"

  ComponentsGlyph = "components"
                  | "directives"
                  | "#"

  FactoriesGlyph = "factories"
                 | "^"

  RoutesGlyph = "routes"
              | "=>"
              | ">"

  Requirement = name JSPackage?
  Component = name Contained<Component*>?
  Factory = name Contained<Factory*>?
  Route = Quoted<path> ":" name

  JSPackage = ":" jsPackageName

  Config = name

  path = routeCharacter+
  routeCharacter = alnum | "/" | "_" | "-" | ":"

  name = nameCharacter+
  nameCharacter = alnum | "_" | "-"

  jsPackageName = name

  Contained<element> = CContained<"{", element, "}">
  Quoted<element> = CContained<"'", element, "'">
  CContained<open, element, close> = open element close
}`;