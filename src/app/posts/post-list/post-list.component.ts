import { Component, OnInit, OnDestroy } from '@angular/core';
import { Post } from '../post.model';
import { PostsService } from 'src/app/services/posts.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})

export class PostListComponent implements OnInit, OnDestroy {
  subscription: Subscription;
  posts: Post[] = [];
  isLoading = false;
  constructor(public postSerice: PostsService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postSerice.getPosts();
    this.subscription = this.postSerice.getPostsUpdateListener()
      .subscribe((posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.postSerice.deletePosts(postId);
  }

}
