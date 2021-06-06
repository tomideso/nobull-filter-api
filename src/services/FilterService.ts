import { injectable, inject } from "inversify";
import TYPES from "@/config/types";
import { AppError } from "@/ErrorHandler/AppError";
import { ConfigurationService } from "./ConfigurationService";
import { WebflowService } from "./WebflowService";
import { Redis } from "ioredis";
import { getRandomNumber, isValidDate, parseNumber } from "@/utility/utility";

const loadmore = {
  button: ".w-pagination-next",
  loadAll: true,
  animation: {
    enable: true,
    duration: 0.2,
    easing: "ease",
    effects: "fade",
  },
};

@injectable()
export class FilterServiceImpl implements FilterService {
  private ConfigurationServiceImpl: ConfigurationService;
  private WebflowServiceImpl: WebflowService;
  private redisClient: Redis;

  constructor(
    @inject(TYPES.ConfigurationService)
    ConfigurationServiceImpl: ConfigurationService,
    @inject(TYPES.WebflowService)
    WebflowServiceImpl: WebflowService,
    @inject(TYPES.Redis) redisClient: Redis
  ) {
    this.ConfigurationServiceImpl = ConfigurationServiceImpl;
    this.WebflowServiceImpl = WebflowServiceImpl;
    this.redisClient = redisClient;
  }

  public async initFilter({
    configID,
    filterCollection,
    filterGroupID,
    filterElementID,
  }) {
    const identifier = `${configID}-filter-${filterGroupID}-${filterElementID}`;

    // console.log(identifier);
    try {
      const cachedResult = await this.redisClient.get(identifier);

      if (cachedResult) return JSON.parse(cachedResult);

      const { filters } = await this.ConfigurationServiceImpl.getByID(configID);

      const filter = filters.find(
        ({ name }) => convertToKebabCaseNaming(name) == filterCollection
      );

      const group = filter?.groups?.find(
        ({ name }) => convertToKebabCaseNaming(name) == filterGroupID
      );

      const elements = group?.elements?.find(({ filterBy, trigger }) => {
        return (
          new RegExp(filterBy, "gi").test(filterElementID) &&
          trigger == "Static Div, Button, Link"
        );
      });

      // console.log({ elements, filterElementID });
      if (elements) {
        const collectionItems = await this.WebflowServiceImpl.getCollectionItems(
          undefined,
          filter.collectionID
        );

        const result = this.executeRules(elements?.logicRules, collectionItems);

        this.redisClient.setex(identifier, 4 * 60, JSON.stringify(result));

        return result;
      } else {
      }
    } catch (error) {
      throw new AppError(error, 400);
    }
  }

  public async generateClientConfig(configID = "607204a8f1bab03a61a1d897") {
    try {
      const { filters } = await this.ConfigurationServiceImpl.getByID(configID);

      const fsConfig = filters?.map(({ name, groups }) => {
        const filterName = convertToKebabCaseNaming(name);

        const filterArray = groups.map(({ name, filterOption: filterType }) => {
          const groupName = convertToKebabCaseNaming(name);

          return {
            filterWrapper: `[filter-group='${groupName}']`,
            filterType,
          };
        });

        // run filter on our instance
        const filter = {
          filterArray, // the filter group name we defined
          activeClass: "fs-active", // the active class we give to our buttons
          animation: {
            enable: true,
            duration: 200,
            easing: "ease-out",
            effects: "fade translate(0px,20px)",
          },
        };

        return getLibraryInstanceTemplate({ loadmore, filter, filterName });
      });

      return fsConfig.join("\n");
    } catch (error) {}
  }

  protected executeRules(rules: Array<logicRule> = [], collectionItems = []) {
    return collectionItems.reduce((acc, item) => {
      const result = rules.reduce((accum, curr, j) => {
        let { operator, value, joiner: logic, field, fieldType } = curr;

        let filterText = item[field];

        const re = new RegExp(value, "gi");

        logic = /&&|And/i.test(logic) ? "&&" : "||";

        let result = accum;

        switch (operator) {
          case "contain":
            result = re.test(filterText);
            break;

          case "not_contain":
            result = !re.test(filterText);
            break;

          case "==":
            result = filterText == value;

            break;

          default:
            result = eval(`${parseNumber(filterText)} ${operator} ${value}`);
            break;
        }

        return eval(`${accum} ${logic} ${result}`);
      }, true);

      return result ? [...acc, item.slug] : acc;
    }, []);
  }
}

export interface FilterService {
  initFilter(queryObject: queryObject): Promise<any>;

  generateClientConfig(configID: string): Promise<any>;
}

const getLibraryInstanceTemplate = ({ filter, loadmore, filterName }) => {
  return `
        (function() {
            
            const nobullShit = new NobullLibrary('[filter-collection="${filterName}"]');
            
            nobullShit.loadmore(${JSON.stringify(loadmore)});
             
            nobullShit.filter(${JSON.stringify(filter)});

        })();
        `;
};

const convertToKebabCaseNaming = (name = "") => {
  return name.toLowerCase().replace(/\s+/g, "-");
};

interface logicRule {
  _id?: string;
  operator: string;
  value: string;
  joiner: string;
  field: string;
  fieldType: string;
}

interface queryObject {
  configID: string;
  filterGroupID: string;
  filterCollection: string;
  filterElementID: string;
}
