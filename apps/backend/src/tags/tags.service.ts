import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async create(createTagDto: CreateTagDto): Promise<Tag> {
    const tag = this.tagsRepository.create(createTagDto);
    return this.tagsRepository.save(tag);
  }

  async findAll(): Promise<Tag[]> {
    return this.tagsRepository.find({
      order: { name: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({ where: { id } });
    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }
    return tag;
  }

  async findOrCreate(name: string, color?: string): Promise<Tag> {
    let tag = await this.tagsRepository.findOne({ where: { name } });
    if (!tag) {
      tag = await this.create({ name, color });
    }
    return tag;
  }

  async findByNames(names: string[]): Promise<Tag[]> {
    const tags: Tag[] = [];
    for (const name of names) {
      const tag = await this.findOrCreate(name);
      tags.push(tag);
    }
    return tags;
  }
}
