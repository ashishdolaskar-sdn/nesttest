import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Test } from './state.model';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { AddStateDto, LoginDto } from 'src/middleware/signupdto';
import { HttpStatusCodes, ErrorMessages } from '../middleware/errorMessage';
@Injectable()
export class StateService {
  private readonly blacklist = new Set<string>();
  constructor(
    @InjectModel('signup') private readonly stateModel: Model<Test>,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService

  ) {}

  // StateService
async insertState(
  createUserDto: AddStateDto
) {
  try {
    const { name, email, password } = createUserDto;
    const existingUser = await this.stateModel.findOne({ email }).exec();
    if (existingUser) {
      return { status: HttpStatusCodes.BAD_REQUEST, message: ErrorMessages.USER_EXISTS, error: null };
    }

    if (password.length < 6) {
      return { status: HttpStatusCodes.BAD_REQUEST, message: ErrorMessages.SHORT_PASSWORD, error: null };
    }

    const newState = new this.stateModel({
      name,
        email,
        password,
    });
    const result = await newState.save();
    return { status: HttpStatusCodes.OK, message: 'State added successfully', data: { id: result.id } };
  } catch (error) {
    return { status: HttpStatusCodes.INTERNAL_SERVER_ERROR, message: ErrorMessages.INTERNAL_SERVER_ERROR, error: error.message };
  }
}

// StateService
async validateUser(createloginDto:LoginDto) {
  try {
    const { email, password } = createloginDto;
    const user = await this.stateModel.findOne({ email }).exec();

    if (user && user.password === password) {
      const payload = { email: user.email, sub: user.id };
      const accessToken = this.jwtService.sign(payload);

      return {
        status: HttpStatusCodes.OK,
        message: 'Login successful',
        data: {
          accessToken,
        },
      };
    } else {
      return {
        status: HttpStatusCodes.UNAUTHORIZED,
        message: ErrorMessages.INVALID_CREDENTIALS,
        data: null,
      };
    }
  } catch (error) {
    return { status: HttpStatusCodes.INTERNAL_SERVER_ERROR, message: ErrorMessages.INTERNAL_SERVER_ERROR, error: error.message };
  }
}

getRandomJoke(): Observable<any> {
  return this.httpService.get('https://api.chucknorris.io/jokes/random').pipe(
    map(response => {
      const { categories, created_at, icon_url, id, updated_at, url, value } = response.data;
      return {
        categories,
        created_at,
        icon_url,
        id,
        updated_at,
        url,
        value,
      };
    }),
  );
}
async logout(token: string): Promise<{ status: number; message: string }> {
  try {
    if (this.blacklist.has(token)) {
      return { status: HttpStatusCodes.UNAUTHORIZED, message: ErrorMessages.TOKEN_ALREADY_INVALIDATED };
    }
    this.blacklist.add(token);
    return { status: HttpStatusCodes.OK, message: 'Logout successful' };
  } catch (error) {
    return { status: HttpStatusCodes.INTERNAL_SERVER_ERROR, message: ErrorMessages.INTERNAL_SERVER_ERROR };
  }
}
async getProfile(token: string): Promise<{ status: number; message: string; data?: any }> {
  try {
    const decodedToken = this.jwtService.decode(token) as { email: string; sub: string };
    
    if (!decodedToken || !decodedToken.email || !decodedToken.sub) {
      return { status: HttpStatusCodes.UNAUTHORIZED, message: ErrorMessages.INVALID_TOKEN };
    }

    const user = await this.stateModel.findById(decodedToken.sub).exec();

    if (!user) {
      return { status: HttpStatusCodes.NOT_FOUND, message: ErrorMessages.USER_NOT_FOUND };
    }

    return {
      status: HttpStatusCodes.OK,
      message: 'Profile retrieved successfully',
      data: {
        id: user.id,
        email: user.email,
        // Add other user details as needed
      },
    };
  } catch (error) {
    return { status: HttpStatusCodes.INTERNAL_SERVER_ERROR, message: ErrorMessages.INTERNAL_SERVER_ERROR };
  }
}
}