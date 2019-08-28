import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  private authStatusListenerSub: Subscription;
  userId: string;
  posts: Post[] = [];
  isLoading = false;
  isLoggedIn = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];

  constructor(public postService: PostsService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.postsPerPage);
    this.userId = this.authService.getUserId();
    this.subscription = this.postService.getPostsUpdateListener()
      .subscribe((postData: { post: Post[], postCount: number }) => {
        this.posts = postData.post;
        this.totalPosts = postData.postCount;
        this.isLoading = false;
      });
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.authStatusListenerSub = this.authService.getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.isLoggedIn = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.authStatusListenerSub.unsubscribe();
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
