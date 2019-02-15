import { Router } from 'express';
declare class IndexRouter {
    router: Router;
    constructor(router?: Router);
    getRouter(): Router;
}
export default IndexRouter;
