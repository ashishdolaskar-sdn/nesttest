import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StateService } from './state.service';
import { Observable } from 'rxjs';

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post('add')
  async addState(
    @Body('name') name: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const result = await this.stateService.insertState(name, email, password);
    return result;
  }
  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    const result = await this.stateService.validateUser(email, password);
    return result;
  }

  @Get('random-joke')
  getRandomJoke(): Observable<any> {
    return this.stateService.getRandomJoke();
  }

  @Post('logout')
  async logout(@Body('token') token: string): Promise<{ status: number; message: string }> {
    const result = await this.stateService.logout(token);
    return result;
  }

  @Get('profile')
  async getProfile(@Query('token') token: string): Promise<{ status: number; message: string; data?: any }> {
    const result = await this.stateService.getProfile(token);
    return result;
  }
}
