import {Test} from '@nestjs/testing';
import {JwtService} from '@nestjs/jwt';
import {UnauthorizedException} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {AuthService} from './auth.module';
import {PrismaService} from '../prisma/prisma.module';
describe('AuthService with mocked persistence and JWT boundary', () => {
  let service: AuthService;
  const findUnique = jest.fn();
  const sign = jest.fn(() => 'unit-signed-token');
  const user = {id: 'unit-user', email: 'qa@shopai.test', name: 'QA', password: bcrypt.hashSync('test-password', 4)};
  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({providers: [AuthService, {provide: PrismaService, useValue: {user: {findUnique}}}, {provide: JwtService, useValue: {sign}}]}).compile();
    service = module.get(AuthService);
  });
  it('verifies password before issuing a token; never returns the password hash', async () => {
    findUnique.mockResolvedValue(user);
    const result = await service.login({email: ' QA@SHOPAI.TEST ', password: 'test-password'});
    expect(findUnique).toHaveBeenCalledWith({where: {email: user.email}});
    expect(sign).toHaveBeenCalledWith({sub: user.id, email: user.email});
    expect(result).toEqual({accessToken: 'unit-signed-token', user: {id: user.id, email: user.email, name: user.name}});
  });
  it('rejects an unknown email without issuing a JWT', async () => {
    findUnique.mockResolvedValue(null);
    await expect(service.login({email: 'missing@shopai.test', password: 'test-password'})).rejects.toBeInstanceOf(UnauthorizedException);
    expect(sign).not.toHaveBeenCalled();
  });
  it('rejects the wrong password without issuing a JWT', async () => {
    findUnique.mockResolvedValue(user);
    await expect(service.login({email: user.email, password: 'wrong-password'})).rejects.toBeInstanceOf(UnauthorizedException);
    expect(sign).not.toHaveBeenCalled();
  });
});
