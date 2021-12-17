import { ApiProperty } from "@nestjs/swagger";
import { TagsDto } from "src/modules/tags/dto/tags.dto";


export class PostsDto implements Readonly<PostsDto>{

    @ApiProperty({ type: String })
    content: string

    @ApiProperty({ type: Array, required: false })
    tags: TagsDto[];

}