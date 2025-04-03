import * as authService from './auth-service';
import * as groupService from './group-service';
import * as meetingService from './meeting-service';
import * as eventService from './event-service';
import * as treasuryService from './treasury-service';

class ServiceManager {
  private static instance: ServiceManager;
  private services: Record<string, any> = {};

  private constructor() {
    this.services = {
      auth: authService,
      group: groupService,
      meeting: meetingService,
      event: eventService,
      treasury: treasuryService,
    };
  }

  public static getInstance(): ServiceManager {
    if (!ServiceManager.instance) {
      ServiceManager.instance = new ServiceManager();
    }
    return ServiceManager.instance;
  }

  public getService(serviceName: string): any {
    return this.services[serviceName];
  }
}

export default ServiceManager;
