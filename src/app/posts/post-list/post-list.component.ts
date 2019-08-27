import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postService: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.postsPerPage);
    this.subscription = this.postService.getPostsUpdateListener()
      .subscribe((postData: { post: Post[], postCount: number }) => {
        this.posts = postData.post;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePosts(postId).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onChangeEvent(pageEvent: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageEvent.pageIndex + 1;
    this.postsPerPage = pageEvent.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
  }
}
