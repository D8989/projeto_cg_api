type MyObject = {
  [key: string]: {
    colums: string[];
    isInner?: boolean;
    joinInfo?: MyObjJoin;
  };
};
