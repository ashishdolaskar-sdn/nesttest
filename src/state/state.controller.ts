import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { StateService } from './state.service';
import { Observable } from 'rxjs';
import { AddStateDto, LoginDto } from "../middleware/signupdto"

@Controller('state')
export class StateController {
  constructor(private readonly stateService: StateService) {}

  @Post('add')
  async addState(
    @Body() createUserDto: AddStateDto
  ) {
    const result = await this.stateService.insertState(createUserDto);
    return result;
  }
  @Post('login')
  async login(
    @Body() createloginDto:LoginDto
  ) {
    const result = await this.stateService.validateUser(createloginDto);
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
